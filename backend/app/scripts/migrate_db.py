"""
Migration script to add missing columns to SQLite database.
Run: python -m app.scripts.migrate_db
"""
from sqlalchemy import text
from app.core.database import engine

def migrate_db():
    with engine.connect() as conn:
        print("Checking database schema...")
        
        # Game Mode columns
        columns = [
            ("time_limit", "INTEGER"),
            ("max_lives", "INTEGER DEFAULT 3"),
            ("total_rounds", "INTEGER"),
            ("vote_seconds", "INTEGER"),
            ("icon", "VARCHAR") 
        ]
        
        for col_name, col_type in columns:
            try:
                conn.execute(text(f"ALTER TABLE game_modes ADD COLUMN {col_name} {col_type}"))
                print(f"Added {col_name} column to game_modes table.")
            except Exception as e:
                # SQLite error for duplicate column usually contains specific text
                if "duplicate column" in str(e).lower() or "no such table" in str(e).lower(): 
                   print(f"Column {col_name} already exists.")
                else:
                   print(f"Note for {col_name}: {e}")

        print("Migration check complete.")

if __name__ == "__main__":
    migrate_db()
