from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=True)
    
    # Statistics
    total_games = Column(Integer, default=0, nullable=False)
    games_won = Column(Integer, default=0, nullable=False)
    games_lost = Column(Integer, default=0, nullable=False)
    total_score = Column(Integer, default=0, nullable=False, index=True)
    best_time = Column(Float, nullable=True)
    
    # Settings
    preferred_difficulty = Column(String(20), default="medium")
    is_sound_enabled = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships are likely defined in back_populates in other files or here if needed
    # But based on missing content I'll stop here unless I see relation usage.


