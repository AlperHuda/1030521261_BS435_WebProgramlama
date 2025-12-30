"""
Seed script to populate database with game modes logic.
Run: python -m app.scripts.seed_game_modes
"""
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.game_mode import GameMode


def seed_game_modes(db: Session):
    """Add game modes to database with specific rules"""
    
    # Check if already seeded - Update existing or create new
    print("Seeding game modes...")
    
    modes_data = [
        {
            "name": "standard",
            "display_name": "Standart Mod",
            "description": "Klasik oyun deneyimi. 10 tur, süre kısıtlaması yok, 3 can hakkı.",
            "icon": "standard",
            "time_limit": None,
            "max_lives": 3,
            "total_rounds": 10,
            "is_active": True
        },
        {
            "name": "time_attack",
            "display_name": "Zamana Karşı",
            "description": "30 saniye içinde doğru tahmini yap! 10 tur boyunca en hızlı sen ol.",
            "icon": "timer",
            "time_limit": 30,  # 30 seconds per round
            "max_lives": 3,
            "total_rounds": 10,
            "is_active": True
        },
        {
            "name": "marathon",
            "display_name": "Maraton",
            "description": "Tek can hakkı! Hata yapana kadar devam et. En yüksek skorunu zorla.",
            "icon": "infinity",
            "time_limit": 15,  # 15 seconds pressure
            "max_lives": 1,    # Single elimination
            "total_rounds": None, # Infinite
            "is_active": True
        }
    ]
    
    for mode_data in modes_data:
        mode = db.query(GameMode).filter(GameMode.name == mode_data["name"]).first()
        if not mode:
            mode = GameMode(**mode_data)
            db.add(mode)
            print(f"Created mode: {mode_data['display_name']}")
        else:
            # Update existing
            for key, value in mode_data.items():
                setattr(mode, key, value)
            print(f"Updated mode: {mode_data['display_name']}")
    
    db.commit()
    print(f"Successfully seeded game modes!")


def main():
    # Make sure tables exist (especially if we added new columns)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_game_modes(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
