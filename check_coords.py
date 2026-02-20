import sqlite3
import os

DB_PATH = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2", "db.sqlite")

def check_coords():
    if not os.path.exists(DB_PATH):
        print(f"DB not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Count Total
    cur.execute("SELECT COUNT(*) FROM emsal")
    total = cur.fetchone()[0]
    
    # Count Missing Coords
    cur.execute("SELECT COUNT(*) FROM emsal WHERE lat IS NULL OR lng IS NULL OR lat=0 OR lng=0")
    missing = cur.fetchone()[0]
    
    print(f"Total Emsals: {total}")
    print(f"Missing Coords: {missing}")
    
    if missing > 0:
        print("\nExamples of missing coords:")
        cur.execute("SELECT id, tur, mahalle FROM emsal WHERE lat IS NULL OR lng IS NULL OR lat=0 OR lng=0 LIMIT 5")
        for r in cur.fetchall():
            print(f"ID: {r[0]} | Type: {r[1]} | Mahalle: {r[2]}")

    conn.close()

if __name__ == "__main__":
    check_coords()
