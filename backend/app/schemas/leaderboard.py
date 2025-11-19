from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class LeaderboardEntryCreate(BaseModel):
    player_name: str = Field(..., min_length=1, max_length=100)
    score: int = Field(..., ge=0)
    time_taken: float = Field(..., gt=0)
    game_mode: str
    category: Optional[str] = None
    round_id: Optional[int] = None


class LeaderboardEntryResponse(BaseModel):
    id: int
    player_name: str
    score: int
    time_taken: float
    game_mode: str
    category: Optional[str] = None
    created_at: datetime
    rank: Optional[int] = None

    class Config:
        from_attributes = True


class LeaderboardQuery(BaseModel):
    game_mode: Optional[str] = None
    category: Optional[str] = None
    limit: int = Field(default=10, ge=1, le=100)

