import sqlite3
import os

BASE_DIR = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2")
DB_PATH = os.path.join(BASE_DIR, "db.sqlite")

def fix_db():
    print(f"Connecting to database at {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    new_cols = [
        ("brut_m2", "REAL"), ("net_m2", "REAL"), ("arsa_m2", "REAL"), ("kaks", "REAL"), 
        ("bina_yasi", "INTEGER"), ("bina_kat_sayisi", "INTEGER"), ("bulundugu_kat", "INTEGER"),
        ("kat", "TEXT"), ("cephe", "TEXT"), ("isitma", "TEXT"), 
        ("otopark", "INTEGER"), ("tapu", "TEXT"), ("imar", "TEXT"),
        ("oda_sayisi", "TEXT"),
        ("asansor", "INTEGER"), ("esyali", "INTEGER"), ("site_icerisinde", "INTEGER"),
        ("kaynak", "TEXT"), ("listing_type", "TEXT")
    ]

    for col_name, col_type in new_cols:
        try:
            print(f"Adding column {col_name}...")
            cur.execute(f"ALTER TABLE emsal ADD COLUMN {col_name} {col_type}")
            print(f"Added {col_name} successfully.")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e):
                print(f"Column {col_name} already exists.")
            else:
                print(f"Error adding {col_name}: {e}")

    conn.commit()
    conn.close()
    print("Database fix completed.")

if __name__ == "__main__":
    fix_db()
