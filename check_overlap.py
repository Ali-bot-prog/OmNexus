import sqlite3
import os

from config import DB_PATH  # centralized in config.py

def check_overlap():
    if not os.path.exists(DB_PATH):
        print(f"DB not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Query for exact lat/lng duplicates
    cur.execute("""
        SELECT lat, lng, COUNT(*) as c, GROUP_CONCAT(id) as ids 
        FROM emsal 
        WHERE lat IS NOT NULL AND lat <> 0
        GROUP BY lat, lng 
        HAVING c > 1
    """)
    rows = cur.fetchall()
    
    print(f"Checking for overlapping pins (Exact Lat/Lng duplicates)...")
    if not rows:
        print("No exact duplicates found.")
    else:
        print(f"Found {len(rows)} locations with multiple pins:")
        for r in rows:
            print(f" - Loc ({r[0]}, {r[1]}): {r[2]} pins (IDs: {r[3]})")
            
    conn.close()

if __name__ == "__main__":
    check_overlap()
