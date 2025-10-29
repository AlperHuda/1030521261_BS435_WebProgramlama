from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.database import get_db

router = APIRouter()


@router.get("/health", tags=["system"])
def health() -> dict:
    return {"status": "ok"}


@router.post("/rounds", tags=["game"])
def start_round(db: Session = Depends(get_db)) -> dict:
    # TODO: create a game round and persist
    return {"round_id": 1, "images": ["/a.jpg", "/b.jpg", "/c.jpg"], "ai_index": None}


@router.post("/rounds/{round_id}/guess", tags=["game"])
def submit_guess(round_id: int, index: int, db: Session = Depends(get_db)) -> dict:
    # TODO: evaluate guess and persist
    return {"round_id": round_id, "correct": False, "hint": "Arka plan detaylarına dikkat et."}


@router.get("/stats", tags=["game"])
def stats(db: Session = Depends(get_db)) -> dict:
    # TODO: return simple aggregate stats
    return {"total_rounds": 0, "accuracy": 0.0}
