import sqlite3
from werkzeug.security import generate_password_hash

DATABASE = 'database.db'

def add_multiple_users():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    users_to_add = [
        ('secretary001', 'secretary123', 'secretary'),
        ('accountant001', 'accountant123', 'accountant'),
        ('group_admin001', 'groupadmin123', 'group_admin'),
        ('regional_admin001', 'regionaladmin123', 'regional_admin')
    ]
    
    for username, password, role in users_to_add:
        # Use a compatible hashing method
        hashed_password = generate_password_hash(password)
        try:
            cursor.execute("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
                           (username, hashed_password, role))
            print(f"✅ User '{username}' added successfully!")
        except sqlite3.IntegrityError:
            print(f"⚠️ User '{username}' already exists. Skipping.")
        except sqlite3.OperationalError as e:
            print(f"❌ Error adding user '{username}': {e}. Ensure the 'users' table exists.")
            
    conn.commit()
    conn.close()

if __name__ == '__main__':
    add_multiple_users()