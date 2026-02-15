"""SQLite database connection helpers for the football analytics project."""

import sqlite3
from pathlib import Path
import pandas as pd

DB_PATH = Path(__file__).parent.parent.parent / "data" / "processed" / "football.db"
DATA_RAW = Path(__file__).parent.parent.parent / "data" / "raw"
DATA_PROCESSED = Path(__file__).parent.parent.parent / "data" / "processed"


def get_connection() -> sqlite3.Connection:
    """Get a connection to the SQLite database."""
    DATA_PROCESSED.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def run_query(query: str, params: tuple = ()) -> pd.DataFrame:
    """Execute a SQL query and return results as a DataFrame."""
    conn = get_connection()
    try:
        return pd.read_sql_query(query, conn, params=params)
    finally:
        conn.close()


def run_sql_file(filepath: str) -> pd.DataFrame:
    """Read and execute a .sql file, return results as a DataFrame."""
    with open(filepath, "r", encoding="utf-8") as f:
        query = f.read()
    return run_query(query)


def table_info() -> pd.DataFrame:
    """List all tables in the database with row counts."""
    conn = get_connection()
    try:
        tables = pd.read_sql_query(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", conn
        )
        rows = []
        for table_name in tables["name"]:
            count = pd.read_sql_query(f"SELECT COUNT(*) as cnt FROM [{table_name}]", conn)
            rows.append({"table": table_name, "rows": count["cnt"].iloc[0]})
        return pd.DataFrame(rows)
    finally:
        conn.close()
