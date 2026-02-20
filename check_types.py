import sqlite3
import os

DB_PATH = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2", "db.sqlite")

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
