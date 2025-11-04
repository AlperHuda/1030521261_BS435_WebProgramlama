"""
Seed script to populate database with sample images.
Run: python -m app.scripts.seed_data
"""
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.game import Image


def seed_images(db: Session):
    """Add sample images to database"""
    
    # Check if already seeded
    if db.query(Image).count() > 0:
        print("Database already contains images. Skipping seed.")
        return
    
    sample_images = [
        # Real portraits
        Image(url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", is_ai_generated=False, category="portrait", hint=None),
        Image(url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", is_ai_generated=False, category="portrait", hint=None),
        Image(url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", is_ai_generated=False, category="portrait", hint=None),
        Image(url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", is_ai_generated=False, category="portrait", hint=None),
        
        # AI-generated portraits (placeholder URLs - replace with actual AI images)
        Image(url="https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=AI+Portrait+1", is_ai_generated=True, category="portrait", hint="Gözlerdeki ışık tutarsız, kulaklar simetrik değil"),
        Image(url="https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=AI+Portrait+2", is_ai_generated=True, category="portrait", hint="Arka planda mantıksız detaylar var, saç telleri düzensiz"),
        Image(url="https://via.placeholder.com/400x400/95E1D3/FFFFFF?text=AI+Portrait+3", is_ai_generated=True, category="portrait", hint="Yüz simetrisi çok mükemmel, doğal olmayan"),
        
        # Real landscapes
        Image(url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", is_ai_generated=False, category="landscape", hint=None),
        Image(url="https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400", is_ai_generated=False, category="landscape", hint=None),
        Image(url="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400", is_ai_generated=False, category="landscape", hint=None),
        
        # AI landscapes
        Image(url="https://via.placeholder.com/400x400/F38181/FFFFFF?text=AI+Landscape+1", is_ai_generated=True, category="landscape", hint="Ufuk çizgisi çarpık, perspektif hataları var"),
        Image(url="https://via.placeholder.com/400x400/AA96DA/FFFFFF?text=AI+Landscape+2", is_ai_generated=True, category="landscape", hint="Ağaç gölgeleri mantıksız, bulutlar tekrarlayan pattern"),
    ]
    
    db.add_all(sample_images)
    db.commit()
    
    print(f"Successfully seeded {len(sample_images)} images!")


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_images(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()

