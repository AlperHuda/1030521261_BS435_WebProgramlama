from pydantic import BaseModel
from typing import List, Optional


class RoundCreateResponse(BaseModel):
    round_id: int
    images: List[str]
    ai_index: Optional[int] | None = None


class GuessRequest(BaseModel):
    index: int


class GuessResponse(BaseModel):
    round_id: int
    correct: bool
    hint: str


class StatsResponse(BaseModel):
    total_rounds: int
    accuracy: float
