-- create_items.sql
CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    price REAL NOT NULL
);