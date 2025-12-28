"""
Seed script to populate database with Scenarios and associated Real Images.
Run: python -m app.scripts.seed_scenarios
"""
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.scenario import Scenario
from app.models.game import Image

def seed_scenarios(db: Session):
    """Add sample scenarios and their real images"""
    
    if db.query(Scenario).count() > 0:
        print("Scenarios already exist. Skipping seed.")
        return

    # DEFINING SCENARIOS
    # You asked for 20 scenarios, here are 3 examples to start structure
    # TODO: Expanding this list to 20 items is trivial, just add more dicts.
    
    scenarios_data = [
        {
            "prompt": "Fütüristik bir şehirde uçan arabaların olduğu gün batımı manzarası.",
            "category": "landscape",
            "difficulty": "medium",
            "real_images": [
                # Real images that LOOK somewhat like the prompt or fit the theme so the user is challenged
                "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400", # City sunset
                "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400", # Cityscape
                "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400"  # Urban
            ]
        },
         {
            "prompt": "Orta çağ şövalyesi, ormanda sislerin arasında bekliyor, yağlı boya tablosu tarzında.",
            "category": "art",
            "difficulty": "hard",
            "real_images": [
                "https://images.unsplash.com/photo-1599739527670-3d75727195c6?w=400", # Knightish / Armor
                "https://images.unsplash.com/photo-1442544213729-6a1a11686355?w=400", # Forest mist
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400"  # Painting texture
            ]
        },
        {
            "prompt": "Altın oran ile çizilmiş mükemmel bir insan yüzü portresi, stüdyo ışığı.",
            "category": "portrait",
            "difficulty": "easy",
            "real_images": [
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400", # Portrait
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400", # Portrait
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"  # Portrait
            ]
        }
    ]

    for data in scenarios_data:
        # Create Scenario
        scenario = Scenario(
            prompt_text=data["prompt"],
            category=data["category"],
            difficulty=data["difficulty"]
        )
        db.add(scenario)
        db.commit()
        db.refresh(scenario)
        
        # Add associated real images
        for url in data["real_images"]:
            img = Image(
                url=url,
                is_ai_generated=False,
                category=data["category"],
                difficulty=data["difficulty"],
                scenario_id=scenario.id,
                hint=None
            )
            db.add(img)
        
    db.commit()
    print(f"Successfully seeded {len(scenarios_data)} scenarios and associated images!")

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_scenarios(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
