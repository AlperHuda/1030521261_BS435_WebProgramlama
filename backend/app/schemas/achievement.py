from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AchievementBase(BaseModel):
    name: str
    description: str
    icon_name: str
    category: str
    condition_type: str
    condition_value: int

class AchievementCreate(AchievementBase):
    pass

class Achievement(AchievementBase):
    id: int

    class Config:
        from_attributes = True

class UserAchievementBase(BaseModel):
    user_id: int
    achievement_id: int
    earned_at: datetime

class UserAchievement(UserAchievementBase):
    achievement: Achievement

    class Config:
        from_attributes = True
