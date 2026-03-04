import sqlite3
import os
import bcrypt
from datetime import datetime, timezone

# Config
from config import DB_PATH

def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def get_password_hash(password: str) -> str:
    # bcrypt salt ve hash
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def create_admin():
    if not os.path.exists(DB_PATH):
        print(f"DB not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT id FROM users WHERE username='admin'")
        if cur.fetchone():
            print("Admin already exists (Updating password).")
            new_hash = get_password_hash("admin123")
            cur.execute("UPDATE users SET hashed_password=? WHERE username='admin'", (new_hash,))
            conn.commit()
            print("Admin password updated to 'admin123'")
            return

        print("Creating admin user...")
        admin_pass = get_password_hash("admin123")
        cur.execute(
            """
            INSERT INTO users (username, hashed_password, role, created_at) 
            VALUES (?, ?, ?, ?)
            """,
            ("admin", admin_pass, "admin", _now_iso())
        )
        conn.commit()
        print("Admin user created successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    create_admin()
