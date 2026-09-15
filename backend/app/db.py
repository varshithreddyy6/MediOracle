"""SQLite layer for MediOracle — hospitals, users, sessions, and
per-hospital operational data (shifts, candidates, billing...)."""
import sqlite3, os, threading

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "medioracle.db")
_local = threading.local()

SCHEMA = """
CREATE TABLE IF NOT EXISTS hospitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL REFERENCES hospitals(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Facility Manager',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS wards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  name TEXT NOT NULL, filled INTEGER NOT NULL, required INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  ref TEXT NOT NULL,
  role TEXT NOT NULL, ward TEXT NOT NULL, when_text TEXT NOT NULL,
  gap INTEGER NOT NULL DEFAULT 0, filled INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Open', rate TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  name TEXT NOT NULL, role TEXT NOT NULL, score INTEGER NOT NULL,
  confidence INTEGER NOT NULL, distance TEXT NOT NULL, rating TEXT NOT NULL,
  factors TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS timesheets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  ref TEXT NOT NULL, who TEXT NOT NULL, shift TEXT NOT NULL,
  hours TEXT NOT NULL, status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  ref TEXT NOT NULL, client TEXT NOT NULL, amount TEXT NOT NULL,
  due TEXT NOT NULL, status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  ref TEXT NOT NULL, to_who TEXT NOT NULL, for_what TEXT NOT NULL,
  amount TEXT NOT NULL, status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS professionals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  name TEXT NOT NULL, role TEXT NOT NULL, specialty TEXT NOT NULL,
  rating TEXT NOT NULL, status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS compliance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  who TEXT NOT NULL, item TEXT NOT NULL, expires TEXT NOT NULL, status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS integrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL,
  name TEXT NOT NULL, desc TEXT NOT NULL, status TEXT NOT NULL
);
"""


def conn() -> sqlite3.Connection:
    c = getattr(_local, "c", None)
    if c is None:
        c = sqlite3.connect(DB_PATH, check_same_thread=False)
        c.row_factory = sqlite3.Row
        c.execute("PRAGMA foreign_keys=ON")
        _local.c = c
    return c


def init_db():
    conn().executescript(SCHEMA)
    conn().commit()


def query(sql: str, args: tuple = ()) -> list:
    return conn().execute(sql, args).fetchall()


def execute(sql: str, args: tuple = ()) -> int:
    cur = conn().execute(sql, args)
    conn().commit()
    return cur.lastrowid
