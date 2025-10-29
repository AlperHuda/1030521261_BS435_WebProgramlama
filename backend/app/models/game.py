from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base


class GameRound(Base):
    __tablename__ = "game_rounds"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ai_index = Column(Integer, nullable=True)  # placeholder for future logic

    guesses = relationship("Guess", back_populates="round", cascade="all, delete-orphan")


class Guess(Base):
    __tablename__ = "guesses"

    id = Column(Integer, primary_key=True, index=True)
    round_id = Column(Integer, ForeignKey("game_rounds.id"), nullable=False)
    selected_index = Column(Integer, nullable=False)
    result = Column(String(16), nullable=False)  # 'correct'|'incorrect'
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    round = relationship("GameRound", back_populates="guesses")
