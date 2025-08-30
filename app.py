import sqlite3
from flask import Flask, request, jsonify, g, send_file
from flask_cors import CORS
from datetime import datetime, timedelta
from functools import wraps
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from fpdf import FPDF
from io import BytesIO

DATABASE = 'database.db'
SECRET_KEY = 'your_strong_secret_key'
app = Flask(__name__)
CORS(app)

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                full_name TEXT,
                phone_number TEXT,
                email TEXT,
                gender TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_name TEXT NOT NULL,
                target_amount INTEGER NOT NULL,
                start_date TEXT NOT NULL,
                current_amount INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active'
            )
        ''')
        # --- CHANGES START HERE ---
        # The attendance table is being dropped and recreated to add boy and girl counts.
        cursor.execute('''
            DROP TABLE IF EXISTS attendance;
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                service_date TEXT NOT NULL UNIQUE,
                men INTEGER NOT NULL,
                women INTEGER NOT NULL,
                youth_boys INTEGER NOT NULL,
                youth_girls INTEGER NOT NULL,
                children_boys INTEGER NOT NULL,
                children_girls INTEGER NOT NULL,
                new_converts INTEGER NOT NULL,
                youtube INTEGER NOT NULL,
                total_headcount INTEGER NOT NULL
            )
        ''')
        # --- CHANGES END HERE ---
        cursor.execute('''
            DROP TABLE IF EXISTS payments;
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                payment_type TEXT NOT NULL,
                amount INTEGER NOT NULL,
                description TEXT,
                account_details TEXT,
                receipt_data TEXT,
                receipt_filename TEXT
            )
        ''')
        
        try:
            hashed_password = generate_password_hash('password123', method='scrypt')
            cursor.execute("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
                           ('testuser', hashed_password, 'secretary'))
            db.commit()
            print("Default 'testuser' added.")
        except sqlite3.IntegrityError:
            print("'testuser' already exists.")
            
        db.commit()

# CLI command to initialize the database
@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"error": "Token is missing!"}), 401
        
        if not token:
            return jsonify({"error": "Token is missing!"}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT id, username, role FROM users WHERE username = ?", (data['username'],))
            current_user = cursor.fetchone()
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token is invalid"}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(current_user, *args, **kwargs):
            if current_user['role'] != role and current_user['role'] != 'regional_admin':
                return jsonify({"error": "Permission denied"}), 403
            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"message": "Invalid username or password"}), 401
    
    token = jwt.encode({'username': user['username'], 'exp': datetime.utcnow() + timedelta(hours=24)},
                       SECRET_KEY, algorithm="HS256")
    
    user_info = {
        "username": user['username'],
        "role": user['role']
    }
    
    return jsonify({"message": "Login successful", "token": token, "user": user_info})

@app.route('/api/attendance', methods=['GET'])
@token_required
@role_required('secretary')
def get_attendance(current_user):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM attendance ORDER BY service_date DESC")
    attendance = cursor.fetchall()
    
    attendance_list = []
    for record in attendance:
        attendance_list.append({
            "id": record["id"],
            "service_date": record["service_date"],
            "men": record["men"],
            "women": record["women"],
            "youth_boys": record["youth_boys"],
            "youth_girls": record["youth_girls"],
            "children_boys": record["children_boys"],
            "children_girls": record["children_girls"],
            "new_converts": record["new_converts"],
            "youtube": record["youtube"],
            "total_headcount": record["total_headcount"]
        })
        
    return jsonify({"attendances": attendance_list})

@app.route('/api/attendance/submit', methods=['POST'])
@token_required
@role_required('secretary')
def submit_attendance(current_user):
    data = request.get_json()
    service_date = data.get('service_date')
    men = data.get('men')
    women = data.get('women')
    youth_boys = data.get('youth_boys')
    youth_girls = data.get('youth_girls')
    children_boys = data.get('children_boys')
    children_girls = data.get('children_girls')
    new_converts = data.get('new_converts')
    youtube = data.get('youtube')
    total_headcount = data.get('total_headcount')

    if not all([service_date, men, women, youth_boys, youth_girls, children_boys, children_girls, total_headcount]):
        return jsonify({"error": "Missing attendance data"}), 400
    
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO attendance (service_date, men, women, youth_boys, youth_girls, children_boys, children_girls, new_converts, youtube, total_headcount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (service_date, men, women, youth_boys, youth_girls, children_boys, children_girls, new_converts, youtube, total_headcount))
        db.commit()
        return jsonify({"message": "Attendance recorded successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "An attendance record for this date already exists."}), 409
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/payments', methods=['GET'])
@token_required
@role_required('accountant')
def get_payments(current_user):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM payments ORDER BY date DESC")
    payments = cursor.fetchall()
    
    payments_list = []
    for record in payments:
        payments_list.append({
            "id": record["id"],
            "date": record["date"],
            "payment_type": record["payment_type"],
            "amount": record["amount"],
            "description": record["description"],
            "account_details": record["account_details"],
            "receipt_data": record["receipt_data"],
            "receipt_filename": record["receipt_filename"]
        })
    return jsonify({"payments": payments_list})


@app.route('/api/payments', methods=['POST'])
@token_required
@role_required('accountant')
def record_payment(current_user):
    data = request.get_json()
    date = data.get('date')
    payment_type = data.get('payment_type')
    amount = data.get('amount')
    description = data.get('description')
    account_details = data.get('account_details')
    receipt_data = data.get('receipt_data')
    receipt_filename = data.get('receipt_filename')
    
    if not all([date, payment_type, amount]):
        return jsonify({"error": "Missing payment data"}), 400
    
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO payments (date, payment_type, amount, description, account_details, receipt_data, receipt_filename)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (date, payment_type, amount, description, account_details, receipt_data, receipt_filename))
        db.commit()
        
        return jsonify({"message": "Payment recorded successfully!", "payment": data}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users', methods=['GET'])
@token_required
@role_required('regional_admin')
def get_users(current_user):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT username, role, full_name, phone_number, email, gender FROM users")
    users = cursor.fetchall()
    
    users_list = []
    for user in users:
        users_list.append({
            "username": user['username'],
            "role": user['role'],
            "full_name": user['full_name'],
            "phone_number": user['phone_number'],
            "email": user['email'],
            "gender": user['gender']
        })
        
    return jsonify({"users": users_list})

@app.route('/api/users', methods=['POST'])
@token_required
@role_required('regional_admin')
def create_user(current_user):
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    full_name = data.get('full_name')
    phone_number = data.get('phone_number')
    email = data.get('email')
    gender = data.get('gender')
    
    if not all([username, password, role]):
        return jsonify({"error": "Missing user data"}), 400
        
    password_hash = generate_password_hash(password, method='scrypt')
    
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO users (username, password_hash, role, full_name, phone_number, email, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       (username, password_hash, role, full_name, phone_number, email, gender))
        db.commit()
        
        return jsonify({"message": "User created successfully!", "user": {"username": username, "role": role}}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 409
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects', methods=['POST'])
@token_required
@role_required('regional_admin')
def create_project(current_user):
    data = request.get_json()
    project_name = data.get('project_name')
    target_amount = data.get('target_amount')
    start_date = data.get('start_date')
    
    if not all([project_name, target_amount, start_date]):
        return jsonify({"error": "Missing project data"}), 400
        
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO projects (project_name, target_amount, start_date) VALUES (?, ?, ?)",
                       (project_name, target_amount, start_date))
        db.commit()
        
        return jsonify({"message": "Project created successfully!", "project_name": project_name}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects', methods=['GET'])
@token_required
@role_required('regional_admin')
def get_projects(current_user):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM projects ORDER BY start_date DESC")
    projects = cursor.fetchall()
    
    projects_list = []
    for project in projects:
        projects_list.append({
            "id": project["id"],
            "project_name": project["project_name"],
            "target_amount": project["target_amount"],
            "start_date": project["start_date"],
            "current_amount": project["current_amount"],
            "status": project["status"]
        })
        
    return jsonify({"projects": projects_list})

# --- CHANGES START HERE ---
@app.route('/api/attendance/pdf', methods=['GET'])
@token_required
@role_required('secretary')
def download_attendance_pdf(current_user):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM attendance ORDER BY service_date DESC")
    attendance = cursor.fetchall()
    
    if not attendance:
        return jsonify({"error": "No attendance data to generate a PDF."}), 404

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "Attendance Records", 0, 1, "C")
    pdf.ln(10)

    pdf.set_font("Arial", "B", 8)
    pdf.cell(20, 10, "Date", 1)
    pdf.cell(15, 10, "Men", 1)
    pdf.cell(15, 10, "Women", 1)
    pdf.cell(15, 10, "Yth Boys", 1)
    pdf.cell(15, 10, "Yth Girls", 1)
    pdf.cell(15, 10, "Chd Boys", 1)
    pdf.cell(15, 10, "Chd Girls", 1)
    pdf.cell(20, 10, "New Cnv", 1)
    pdf.cell(20, 10, "Youtube", 1)
    pdf.cell(20, 10, "Total", 1)
    pdf.ln()

    pdf.set_font("Arial", "", 8)
    for record in attendance:
        pdf.cell(20, 8, str(record['service_date']), 1)
        pdf.cell(15, 8, str(record['men']), 1)
        pdf.cell(15, 8, str(record['women']), 1)
        pdf.cell(15, 8, str(record['youth_boys']), 1)
        pdf.cell(15, 8, str(record['youth_girls']), 1)
        pdf.cell(15, 8, str(record['children_boys']), 1)
        pdf.cell(15, 8, str(record['children_girls']), 1)
        pdf.cell(20, 8, str(record['new_converts']), 1)
        pdf.cell(20, 8, str(record['youtube']), 1)
        pdf.cell(20, 8, str(record['total_headcount']), 1)
        pdf.ln()

    # Save the PDF to a BytesIO object
    buffer = BytesIO()
    pdf.output(buffer, 'F')
    buffer.seek(0)
    
    return send_file(buffer, as_attachment=True, download_name='attendance_records.pdf', mimetype='application/pdf')

@app.route('/api/payments/pdf', methods=['GET'])
@token_required
@role_required('accountant')
def download_payments_pdf(current_user):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM payments ORDER BY date DESC")
    payments = cursor.fetchall()
    
    if not payments:
        return jsonify({"error": "No payments data to generate a PDF."}), 404

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "Payment Records", 0, 1, "C")
    pdf.ln(10)

    pdf.set_font("Arial", "B", 10)
    pdf.cell(30, 10, "Date", 1)
    pdf.cell(40, 10, "Type", 1)
    pdf.cell(30, 10, "Amount", 1)
    pdf.cell(60, 10, "Description", 1)
    pdf.ln()

    pdf.set_font("Arial", "", 8)
    for record in payments:
        pdf.cell(30, 8, str(record['date']), 1)
        pdf.cell(40, 8, str(record['payment_type']), 1)
        pdf.cell(30, 8, f"{record['amount']:,}", 1)
        pdf.cell(60, 8, str(record['description'] or ''), 1)
        pdf.ln()

    buffer = BytesIO()
    pdf.output(buffer, 'F')
    buffer.seek(0)
    
    return send_file(buffer, as_attachment=True, download_name='payment_records.pdf', mimetype='application/pdf')

@app.route('/api/account-details', methods=['GET'])
@token_required
@role_required('accountant')
def get_account_details(current_user):
    accounts = [
        {"id": 1, "account_type": "tithe", "account_name": "DLBC Tithe", "account_number": "0123456789", "bank_name": "First Bank", "sort_code": "12-34-56"},
        {"id": 2, "account_type": "offering", "account_name": "DLBC Offering", "account_number": "9876543210", "bank_name": "Zenith Bank", "sort_code": "65-43-21"},
        {"id": 3, "account_type": "building_fund", "account_name": "DLBC Building Fund", "account_number": "1122334455", "bank_name": "Access Bank", "sort_code": "99-88-77"}
    ]
    return jsonify({"accounts": accounts})

# --- CHANGES END HERE ---

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)