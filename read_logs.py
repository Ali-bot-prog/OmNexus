import sqlite3
import os

DB_PATH = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2", "db.sqlite")

def read_logs():
    if not os.path.exists(DB_PATH):
        print("DB Not found")
        return
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    try:
        # Son 10 logu al
        cur.execute("SELECT created_at, action, detail FROM action_log ORDER BY id DESC LIMIT 10")
        rows = cur.fetchall()
        print(f"--- SON LOGLAR ({len(rows)}) ---")
        for r in rows:
            print(f"[{r[0]}] {r[1]} -> {r[2]}")
    except Exception as e:
        print(f"Error: {e}")
    conn.close()

if __name__ == "__main__":
    read_logs()
