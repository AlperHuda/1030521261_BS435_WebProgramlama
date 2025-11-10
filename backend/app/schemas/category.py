from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class GameModeBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None
    is_active: bool = True


class GameModeCreate(GameModeBase):
    pass


class GameModeResponse(GameModeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

