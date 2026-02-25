import sqlite3
import os
path = r'C:\Users\alifa\PusulaGayrimenkulV5_2\app_emlak_v5_2.db'
print("Checking:", path)
print("Exists:", os.path.exists(path))
c = sqlite3.connect(path)
print([r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()])
