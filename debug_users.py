import sqlite3
import os

DB_PATH = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2", "db.sqlite")

def check_users():
    if not os.path.exists(DB_PATH):
        print("DB Not found")
        return
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, username, role, hashed_password FROM users")
        rows = cur.fetchall()
        print(f"Total Users: {len(rows)}")
        for r in rows:
            print(f"ID: {r[0]}, User: {r[1]}, Role: {r[2]}, HashLen: {len(r[3])}")
    except Exception as e:
        print(f"Error: {e}")
    conn.close()

if __name__ == "__main__":
    check_users()
