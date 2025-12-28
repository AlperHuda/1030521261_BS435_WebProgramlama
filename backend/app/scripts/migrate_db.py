"""
Migration script to add missing columns to SQLite database.
Run: python -m app.scripts.migrate_db
"""
from sqlalchemy import text
from app.core.database import engine

def migrate_db():
    with engine.connect() as conn:
        print("Checking database schema...")
        
        # 1. Add scenario_id to images
        try:
            conn.execute(text("ALTER TABLE images ADD COLUMN scenario_id INTEGER REFERENCES scenarios(id)"))
            print("Added scenario_id column to images table.")
        except Exception as e:
            if "duplicate column name" in str(e):
                print("Column scenario_id already exists in images table.")
            else:
                print(f"Error altering images table: {e}")

        # 2. Add scenario_id to game_rounds
        try:
            conn.execute(text("ALTER TABLE game_rounds ADD COLUMN scenario_id INTEGER REFERENCES scenarios(id)"))
            print("Added scenario_id column to game_rounds table.")
        except Exception as e:
            if "duplicate column name" in str(e):
                print("Column scenario_id already exists in game_rounds table.")
            else:
                print(f"Error altering game_rounds table: {e}")

        # 3. Create scenarios table if not exists (This is usually handled by create_all, but good to ensure)
        # However, create_all in main.py should handle new tables. 
        # But if the error was about a column in an existing table, create_all won't fix that.
        
        print("Migration check complete.")

if __name__ == "__main__":
    migrate_db()
