import sqlite3
import os

from config import DB_PATH  # centralized in config.py

def check():
    if not os.path.exists(DB_PATH):
        print(f"DB not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT tur FROM emsal")
    rows = cur.fetchall()
    print("Distinct Types in DB:")
    for r in rows:
        print(f"- '{r[0]}'")
    conn.close()

if __name__ == "__main__":
    check()
