from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    display_name: Optional[str] = Field(None, max_length=100)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    total_games: int
    games_won: int
    games_lost: int
    total_score: int
    best_time: Optional[float]
    created_at: datetime
    last_login: Optional[datetime]

    class Config:
        from_attributes = True


class UserStats(BaseModel):
    total_games: int
    games_won: int
    games_lost: int
    win_rate: float
    total_score: int
    best_time: Optional[float]
    average_score: float


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    username: Optional[str] = None

