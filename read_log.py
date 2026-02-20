import sqlite3
import os

try:
    db_path = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2", "db.sqlite")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT action, detail, created_at FROM action_log ORDER BY id DESC LIMIT 10")
    rows = cur.fetchall()
    if rows:
        with open("error_trace.txt", "w", encoding="utf-8") as f:
            for r in rows:
                f.write(f"[{r[2]}] {r[0]}: {r[1]}\n")
        print("Log written to error_trace.txt")
    else:
        print("NO_ERROR_LOG_FOUND")
    conn.close()
except Exception as e:
    print(f"SCRIPT_ERROR: {e}")
