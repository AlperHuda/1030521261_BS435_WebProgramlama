from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base


class LeaderboardEntry(Base):
    __tablename__ = "leaderboard_entries"

    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String(100), nullable=False, index=True)
    score = Column(Integer, nullable=False)  # Number of correct guesses
    time_taken = Column(Float, nullable=False)  # Time in seconds
    game_mode = Column(String(50), nullable=False, index=True)
    category = Column(String(50), nullable=True)
    round_id = Column(Integer, ForeignKey("game_rounds.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    round = relationship("GameRound", foreign_keys=[round_id])

