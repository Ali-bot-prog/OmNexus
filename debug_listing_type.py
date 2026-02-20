import sqlite3
import os

BASE_DIR = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2")
DB_PATH = os.path.join(BASE_DIR, "db.sqlite")

def check_listing_types():
    if not os.path.exists(DB_PATH):
        print(f"DB Not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT listing_type, COUNT(*) FROM emsal GROUP BY listing_type")
        rows = cur.fetchall()
        print("\n--- Listing Type Distribution ---")
        if not rows:
            print("No records found in 'emsal' table.")
        for row in rows:
            l_type = row[0] if row[0] else "NULL"
            count = row[1]
            print(f"Type: {l_type:<10} Count: {count}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_listing_types()
