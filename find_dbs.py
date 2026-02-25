import sqlite3
import os
import glob

# Search in typical locations
dirs = [
    r'C:\Users\alifa\PusulaGayrimenkulV5',
    r'C:\Users\alifa\PusulaGayrimenkulV5_2',
    r'c:\Users\alifa\Desktop\Projeler\omnexus.com'
]

paths = []
for d in dirs:
    paths.extend(glob.glob(os.path.join(d, "*.db")))
    paths.extend(glob.glob(os.path.join(d, "*.sqlite")))

print("Found DBs:", len(paths))
for p in set(paths):
    try:
        conn = sqlite3.connect(p)
        count = conn.execute("SELECT COUNT(*) FROM emsal").fetchone()[0]
        print(f"[{count} records] -> {p}")
        conn.close()
    except Exception as e:
        print(f"[ERROR or No Table] -> {p} ({e})")
