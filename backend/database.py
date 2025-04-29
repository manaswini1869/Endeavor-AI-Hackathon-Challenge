import sqlite3

def init_db():
    conn = sqlite3.connect("so.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS purchase_orders (
            id INTEGER PRIMARY KEY,
            filename TEXT,
            status TEXT DEFAULT 'pending'
        )
    """)
    conn.commit()
    conn.close()

def save_po(filename, items, matches):
    conn = sqlite3.connect("so.db")
    c = conn.cursor()
    c.execute("INSERT INTO purchase_orders (filename) VALUES (?)", (filename,))
    po_id = c.lastrowid
    conn.commit()
    conn.close()
    return po_id