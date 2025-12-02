from sqlalchemy.orm import Session
from ..models.achievement import Achievement, UserAchievement
from ..models.user import User
from datetime import datetime

class AchievementService:
    @staticmethod
    def initialize_achievements(db: Session):
        """Creates default achievements if they don't exist"""
        defaults = [
            {
                "name": "İlk Adım",
                "description": "İlk oyununuzu tamamlayın",
                "icon_name": "fa-play",
                "category": "Başlangıç",
                "condition_type": "total_games",
                "condition_value": 1
            },
            {
                "name": "Acemi Şanslı",
                "description": "İlk galibiyetinizi alın",
                "icon_name": "fa-star",
                "category": "Başarı",
                "condition_type": "games_won",
                "condition_value": 1
            },
            {
                "name": "Deneyimli Oyuncu",
                "description": "10 oyun tamamlayın",
                "icon_name": "fa-gamepad",
                "category": "Deneyim",
                "condition_type": "total_games",
                "condition_value": 10
            },
            {
                "name": "Usta Oyuncu",
                "description": "50 oyun tamamlayın",
                "icon_name": "fa-crown",
                "category": "Deneyim",
                "condition_type": "total_games",
                "condition_value": 50
            },
            {
                "name": "Şampiyon",
                "description": "10 galibiyet alın",
                "icon_name": "fa-trophy",
                "category": "Başarı",
                "condition_type": "games_won",
                "condition_value": 10
            },
            {
                "name": "Puan Canavarı",
                "description": "Toplam 1000 puana ulaşın",
                "icon_name": "fa-chart-line",
                "category": "Skor",
                "condition_type": "total_score",
                "condition_value": 1000
            }
        ]

        for ach_data in defaults:
            exists = db.query(Achievement).filter(Achievement.name == ach_data["name"]).first()
            if not exists:
                new_ach = Achievement(**ach_data)
                db.add(new_ach)
        db.commit()

    @staticmethod
    def check_achievements(db: Session, user_id: int) -> list[str]:
        """Checks and awards achievements for a user. Returns list of newly earned achievement names."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return []

        all_achievements = db.query(Achievement).all()
        # Get IDs of already earned achievements
        earned_ids = [ua.achievement_id for ua in user.achievements]
        
        newly_earned = []

        for ach in all_achievements:
            if ach.id in earned_ids:
                continue

            earned = False
            if ach.condition_type == "total_games":
                if user.total_games >= ach.condition_value:
                    earned = True
            elif ach.condition_type == "games_won":
                if user.games_won >= ach.condition_value:
                    earned = True
            elif ach.condition_type == "total_score":
                if user.total_score >= ach.condition_value:
                    earned = True
            
            if earned:
                user_ach = UserAchievement(user_id=user.id, achievement_id=ach.id)
                db.add(user_ach)
                newly_earned.append(ach.name)
        
        if newly_earned:
            db.commit()
            
        return newly_earned

    @staticmethod
    def get_user_achievements(db: Session, user_id: int):
        return db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
