from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..schemas.game import (
    RoundCreateRequest, RoundResponse, GuessRequest, GuessResponse,
    StatsResponse, ImagePublic
)
from ..services.game_service import create_round, evaluate_guess, get_stats
from ..models.game import GameRound

router = APIRouter()


@router.get("/health", tags=["system"])
def health() -> dict:
    return {"status": "ok"}


@router.post("/rounds", response_model=RoundResponse, tags=["game"])
def start_round(request: RoundCreateRequest, db: Session = Depends(get_db)):
    """Create a new game round with 3 images (2 real + 1 AI)"""
    try:
        round_obj = create_round(db, category=request.category, difficulty=request.difficulty)
        
        # Prepare response without revealing AI image
        images = [
            ImagePublic(id=round_obj.image1.id, url=round_obj.image1.url),
            ImagePublic(id=round_obj.image2.id, url=round_obj.image2.url),
            ImagePublic(id=round_obj.image3.id, url=round_obj.image3.url),
        ]
        
        return RoundResponse(
            round_id=round_obj.id,
            images=images,
            category=round_obj.category,
            difficulty=round_obj.difficulty
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/rounds/{round_id}/guess", response_model=GuessResponse, tags=["game"])
def submit_guess(round_id: int, request: GuessRequest, db: Session = Depends(get_db)):
    """Submit a guess for a round"""
    try:
        is_correct, attempt_number, game_over, hint = evaluate_guess(
            db, round_id, request.selected_index
        )
        
        # Get round to reveal AI index if game is over
        ai_index = None
        if game_over:
            round_obj = db.query(GameRound).filter(GameRound.id == round_id).first()
            ai_index = round_obj.ai_image_index if round_obj else None
        
        return GuessResponse(
            round_id=round_id,
            is_correct=is_correct,
            attempt_number=attempt_number,
            hint=hint,
            game_over=game_over,
            ai_image_index=ai_index
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/stats", response_model=StatsResponse, tags=["game"])
def get_statistics(db: Session = Depends(get_db)):
    """Get overall game statistics"""
    stats = get_stats(db)
    return StatsResponse(**stats)
