import sqlite3
import os

DB_PATH = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2", "db.sqlite")

def check():
    if not os.path.exists(DB_PATH):
        print("DB Not found")
        return
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(emsal)")
    cols = cur.fetchall()
    for c in cols:
        print(f"Col: {c[1]} Type: {c[2]}")
    conn.close()

if __name__ == "__main__":
    check()
