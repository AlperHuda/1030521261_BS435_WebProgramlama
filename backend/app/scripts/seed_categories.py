"""
Seed script to populate database with categories and game modes.
Run: python -m app.scripts.seed_categories
"""
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.category import Category
from app.models.game_mode import GameMode


def seed_categories(db: Session):
    """Add sample categories to database"""
    
    # Check if already seeded
    if db.query(Category).count() > 0:
        print("Categories already exist. Skipping seed.")
        return
    
    categories = [
        Category(
            name="portrait",
            display_name="Portre",
            description="İnsan yüzleri ve portre fotoğrafları",
            icon="person"
        ),
        Category(
            name="landscape",
            display_name="Manzara",
            description="Doğa ve manzara fotoğrafları",
            icon="landscape"
        ),
        Category(
            name="art",
            display_name="Sanat",
            description="Sanat eserleri ve resimler",
            icon="palette"
        ),
        Category(
            name="architecture",
            display_name="Mimari",
            description="Binalar ve mimari yapılar",
            icon="building"
        ),
        Category(
            name="animals",
            display_name="Hayvanlar",
            description="Hayvan fotoğrafları",
            icon="pets"
        ),
    ]
    
    db.add_all(categories)
    db.commit()
    
    print(f"Successfully seeded {len(categories)} categories!")


def seed_game_modes(db: Session):
    """Add game modes to database"""
    
    # Check if already seeded
    if db.query(GameMode).count() > 0:
        print("Game modes already exist. Skipping seed.")
        return
    
    game_modes = [
        GameMode(
            name="classic",
            display_name="Klasik Mod",
            description="Geleneksel oyun modu. İki tahmin hakkınız var ve ipucu alabilirsiniz.",
            is_active=True
        ),
        GameMode(
            name="timed",
            display_name="Zamana Karşı",
            description="30 saniye içinde doğru tahmini yapın! Hızlı düşünün.",
            is_active=True
        ),
        GameMode(
            name="endless",
            display_name="Sonsuz Mod",
            description="Yanlış yapana kadar devam edin. Kaç doğru yapabilirsiniz?",
            is_active=False  # Will be implemented in future weeks
        ),
    ]
    
    db.add_all(game_modes)
    db.commit()
    
    print(f"Successfully seeded {len(game_modes)} game modes!")


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_categories(db)
        seed_game_modes(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()

