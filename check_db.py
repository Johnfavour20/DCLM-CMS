import sqlite3

DATABASE = 'database.db'

def check_user():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT username, role FROM users WHERE username = ?", ('regional_admin001',))
        user = cursor.fetchone()
        if user:
            print(f"✅ Success! User '{user[0]}' with role '{user[1]}' found in the database.")
            print("You can now log in to the application with this user.")
        else:
            print("❌ Error: The user 'regional_admin001' was not found.")
            print("This likely means the user was not added correctly.")
    except sqlite3.OperationalError:
        print("❌ Error: The 'users' table does not exist.")
        print("Please run `flask initdb` to create the database tables.")
    finally:
        conn.close()

if __name__ == '__main__':
    check_user()