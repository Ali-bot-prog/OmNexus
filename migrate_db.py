import sqlite3
import os

DB_PATH = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2", "db.sqlite")

def migrate():
    print(f"Migrating DB at {DB_PATH}")
    if not os.path.exists(DB_PATH):
        print("DB not found (will be created by app). Skipping migration.")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Check table info
    cur.execute("PRAGMA table_info(emsal)")
    columns = [info[1] for info in cur.fetchall()]
    
    # Add bina_kat_sayisi
    if "bina_kat_sayisi" not in columns:
        print("Adding column: bina_kat_sayisi")
        try:
            cur.execute("ALTER TABLE emsal ADD COLUMN bina_kat_sayisi INTEGER")
        except Exception as e:
            print(f"Error adding bina_kat_sayisi: {e}")
            
    # Add cephe (if missing, though it was in model)
    if "cephe" not in columns:
        print("Adding column: cephe")
        try:
            cur.execute("ALTER TABLE emsal ADD COLUMN cephe TEXT")
        except Exception as e:
            print(f"Error adding cephe: {e}")

    # Add net_m2
    if "net_m2" not in columns:
        print("Adding column: net_m2")
        try:
            cur.execute("ALTER TABLE emsal ADD COLUMN net_m2 REAL")
        except Exception as e:
            print(f"Error adding net_m2: {e}")

    # Add bulundugu_kat
    if "bulundugu_kat" not in columns:
        print("Adding column: bulundugu_kat")
        try:
            cur.execute("ALTER TABLE emsal ADD COLUMN bulundugu_kat INTEGER")
        except Exception as e:
            print(f"Error adding bulundugu_kat: {e}")

    # Add kaynak
    if "kaynak" not in columns:
        print("Adding column: kaynak")
        try:
            cur.execute("ALTER TABLE emsal ADD COLUMN kaynak TEXT")
        except Exception as e:
            print(f"Error adding kaynak: {e}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
