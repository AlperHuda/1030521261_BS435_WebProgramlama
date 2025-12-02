from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..services.auth import get_current_user
from ..schemas import achievement as schemas
from ..services.achievement_service import AchievementService
from ..models.user import User

router = APIRouter()

@router.post("/initialize", status_code=201)
def initialize_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Initialize default achievements (Admin only ideally, but keeping open for simplicity/demo)"""
    AchievementService.initialize_achievements(db)
    return {"message": "Achievements initialized"}

@router.get("/my-achievements", response_model=List[schemas.UserAchievement])
def read_my_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get achievements for the current user"""
    # Also trigger a check to ensure everything is up to date
    AchievementService.check_achievements(db, current_user.id)
    return AchievementService.get_user_achievements(db, current_user.id)

@router.get("/{user_id}", response_model=List[schemas.UserAchievement])
def read_user_achievements(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get achievements for a specific user"""
    return AchievementService.get_user_achievements(db, user_id)
