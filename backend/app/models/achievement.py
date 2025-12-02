from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base

# Association table for User and Achievement many-to-many relationship with extra data (earned_at)
class UserAchievement(Base):
    __tablename__ = "user_achievements"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), primary_key=True)
    earned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="users")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=False)
    icon_name = Column(String(100), nullable=False) # e.g. "fa-trophy", "fa-star" or image identifiers
    category = Column(String(100), nullable=False) # e.g. "Games", "Social", "Expertise"
    
    # Logic defining fields (optional, can be handled in logic code too, but good to have metadata)
    condition_type = Column(String(50), nullable=False) # e.g., "count_games", "count_wins", "streak"
    condition_value = Column(Integer, nullable=False) # e.g., 10, 50, 5
    
    users = relationship("UserAchievement", back_populates="achievement")
