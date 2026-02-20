import sqlite3
import os

DB_PATH = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2", "db.sqlite")

def migrate():
    print(f"Connecting to {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    try:
        print("Attempting to add 'durum' column...")
        cur.execute("ALTER TABLE emsal ADD COLUMN durum TEXT DEFAULT 'aktif'")
        print("SUCCESS: 'durum' column added.")
    except sqlite3.OperationalError as e:
        print(f"INFO: {e} (Column likely already exists)")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
