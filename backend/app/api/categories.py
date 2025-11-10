from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..models.category import Category
from ..models.game_mode import GameMode
from ..schemas.category import CategoryResponse, GameModeResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """List all available categories"""
    categories = db.query(Category).all()
    return categories


@router.get("/{category_name}/stats", tags=["categories"])
def get_category_stats(category_name: str, db: Session = Depends(get_db)):
    """Get statistics for a specific category"""
    from ..models.game import Image, GameRound
    
    # Check if category exists
    category = db.query(Category).filter(Category.name == category_name).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    total_images = db.query(Image).filter(Image.category == category_name).count()
    ai_images = db.query(Image).filter(
        Image.category == category_name,
        Image.is_ai_generated == True
    ).count()
    real_images = total_images - ai_images
    
    total_rounds = db.query(GameRound).filter(
        GameRound.category == category_name,
        GameRound.completed == True
    ).count()
    
    return {
        "category": category.display_name,
        "total_images": total_images,
        "ai_images": ai_images,
        "real_images": real_images,
        "total_rounds_played": total_rounds
    }


@router.get("/modes", response_model=List[GameModeResponse], tags=["game_modes"])
def list_game_modes(db: Session = Depends(get_db)):
    """List all available game modes"""
    modes = db.query(GameMode).filter(GameMode.is_active == True).all()
    return modes

