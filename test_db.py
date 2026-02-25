import sqlite3
c=sqlite3.connect(r'C:\Users\alifa\PusulaGayrimenkulV5_2\app_emlak_v5_2.db')
try:
    print('T:', [row[0] for row in c.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()])
    print('emsal count:', c.execute('SELECT COUNT(*) FROM emsal').fetchone()[0])
except Exception as e:
    print("Error:", e)
