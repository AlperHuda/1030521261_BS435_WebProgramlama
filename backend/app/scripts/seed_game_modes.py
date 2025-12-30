from sqlalchemy.orm import Session
from app.models.game_mode import GameMode

def seed_game_modes(db: Session):
    """Seed default game modes"""
    
    modes = [
        {
            "name": "standard",
            "display_name": "Standart Mod",
            "description": "Klasik oyun deneyimi. 10 tur, süre kısıtlaması yok.",
            "is_active": True
        },
        {
            "name": "time_attack",
            "display_name": "Zamana Karşı",
            "description": "En kısa sürede en çok doğruyu yapmaya çalış!",
            "is_active": True
        },
        {
            "name": "marathon",
            "display_name": "Maraton",
            "description": "Hata yapana kadar devam et. En yüksek skorunu zorla!",
            "is_active": True
        },
        {
            "name": "duel",
            "display_name": "Düello",
            "description": "Arkadaşınla gerçek zamanlı yarış.",
            "is_active": True
        }
    ]

    for mode_data in modes:
        exists = db.query(GameMode).filter(GameMode.name == mode_data["name"]).first()
        if not exists:
            mode = GameMode(**mode_data)
            db.add(mode)
            print(f"Adding game mode: {mode_data['display_name']}")
    
    db.commit()
