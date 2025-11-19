from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ImageBase(BaseModel):
    url: str
    is_ai_generated: bool
    category: Optional[str] = None
    hint: Optional[str] = None


class ImageCreate(ImageBase):
    pass


class ImageResponse(ImageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ImagePublic(BaseModel):
    """Public image data (without revealing if AI generated)"""
    id: int
    url: str


class RoundCreateRequest(BaseModel):
    category: Optional[str] = None
    difficulty: Optional[str] = Field(default="medium", pattern="^(easy|medium|hard)$")
    game_mode: Optional[str] = Field(default="classic", pattern="^(classic|timed)$")
    time_limit: Optional[int] = Field(default=30, ge=10, le=120)


class RoundResponse(BaseModel):
    round_id: int
    images: List[ImagePublic]
    category: Optional[str] = None
    difficulty: str
    game_mode: Optional[str] = "classic"
    time_limit: Optional[int] = None
    start_time: Optional[datetime] = None

    class Config:
        from_attributes = True


class GuessRequest(BaseModel):
    selected_index: int = Field(..., ge=0, le=2)


class GuessResponse(BaseModel):
    round_id: int
    is_correct: bool
    attempt_number: int
    hint: Optional[str] = None
    game_over: bool
    ai_image_index: Optional[int] = None  # Only revealed when game is over


class StatsResponse(BaseModel):
    total_rounds: int
    total_guesses: int
    correct_first_attempt: int
    correct_second_attempt: int
    failed: int
    accuracy: float
