from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from ..core.database import get_db
from ..models.leaderboard import LeaderboardEntry
from ..schemas.leaderboard import LeaderboardEntryCreate, LeaderboardEntryResponse

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.post("", response_model=LeaderboardEntryResponse, status_code=201)
def create_leaderboard_entry(
    entry: LeaderboardEntryCreate,
    db: Session = Depends(get_db)
):
    """Create a new leaderboard entry"""
    db_entry = LeaderboardEntry(
        player_name=entry.player_name,
        score=entry.score,
        time_taken=entry.time_taken,
        game_mode=entry.game_mode,
        category=entry.category,
        round_id=entry.round_id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    return LeaderboardEntryResponse(
        id=db_entry.id,
        player_name=db_entry.player_name,
        score=db_entry.score,
        time_taken=db_entry.time_taken,
        game_mode=db_entry.game_mode,
        category=db_entry.category,
        created_at=db_entry.created_at
    )


@router.get("", response_model=List[LeaderboardEntryResponse])
def get_leaderboard(
    game_mode: Optional[str] = Query(None, description="Filter by game mode"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(10, ge=1, le=100, description="Number of entries to return"),
    db: Session = Depends(get_db)
):
    """Get leaderboard entries with optional filters"""
    query = db.query(LeaderboardEntry)
    
    if game_mode:
        query = query.filter(LeaderboardEntry.game_mode == game_mode)
    
    if category:
        query = query.filter(LeaderboardEntry.category == category)
    
    # Order by score (desc), then by time_taken (asc for ties)
    entries = query.order_by(
        desc(LeaderboardEntry.score),
        LeaderboardEntry.time_taken
    ).limit(limit).all()
    
    # Add rank to each entry
    result = []
    for rank, entry in enumerate(entries, start=1):
        result.append(LeaderboardEntryResponse(
            id=entry.id,
            player_name=entry.player_name,
            score=entry.score,
            time_taken=entry.time_taken,
            game_mode=entry.game_mode,
            category=entry.category,
            created_at=entry.created_at,
            rank=rank
        ))
    
    return result


@router.get("/top/{game_mode}", response_model=List[LeaderboardEntryResponse])
def get_top_by_mode(
    game_mode: str,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get top players for a specific game mode"""
    entries = db.query(LeaderboardEntry).filter(
        LeaderboardEntry.game_mode == game_mode
    ).order_by(
        desc(LeaderboardEntry.score),
        LeaderboardEntry.time_taken
    ).limit(limit).all()
    
    result = []
    for rank, entry in enumerate(entries, start=1):
        result.append(LeaderboardEntryResponse(
            id=entry.id,
            player_name=entry.player_name,
            score=entry.score,
            time_taken=entry.time_taken,
            game_mode=entry.game_mode,
            category=entry.category,
            created_at=entry.created_at,
            rank=rank
        ))
    
    return result


@router.get("/player/{player_name}", response_model=List[LeaderboardEntryResponse])
def get_player_entries(
    player_name: str,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all entries for a specific player"""
    entries = db.query(LeaderboardEntry).filter(
        LeaderboardEntry.player_name == player_name
    ).order_by(
        desc(LeaderboardEntry.created_at)
    ).limit(limit).all()
    
    if not entries:
        raise HTTPException(status_code=404, detail="Player not found")
    
    return [
        LeaderboardEntryResponse(
            id=entry.id,
            player_name=entry.player_name,
            score=entry.score,
            time_taken=entry.time_taken,
            game_mode=entry.game_mode,
            category=entry.category,
            created_at=entry.created_at
        )
        for entry in entries
    ]

