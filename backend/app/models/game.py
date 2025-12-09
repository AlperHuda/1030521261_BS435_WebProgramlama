from sqlalchemy import Column, Integer, DateTime, ForeignKey, String, Boolean, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), nullable=False)
    is_ai_generated = Column(Boolean, nullable=False, default=False)
    category = Column(String(50), nullable=True)  # "portrait", "landscape", "art", etc.
    difficulty = Column(String(20), default="medium") # easy, medium, hard
    hint = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class GameRound(Base):
    __tablename__ = "game_rounds"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ai_image_index = Column(Integer, nullable=False)  # 0, 1, or 2
    image1_id = Column(Integer, ForeignKey("images.id"), nullable=False)
    image2_id = Column(Integer, ForeignKey("images.id"), nullable=False)
    image3_id = Column(Integer, ForeignKey("images.id"), nullable=False)
    category = Column(String(50), nullable=True)
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    game_mode = Column(String(50), default="classic")  # classic, timed
    completed = Column(Boolean, default=False)
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    time_limit = Column(Integer, nullable=True)  # seconds, for timed mode

    image1 = relationship("Image", foreign_keys=[image1_id])
    image2 = relationship("Image", foreign_keys=[image2_id])
    image3 = relationship("Image", foreign_keys=[image3_id])
    guesses = relationship("Guess", back_populates="round", cascade="all, delete-orphan")


class Guess(Base):
    __tablename__ = "guesses"

    id = Column(Integer, primary_key=True, index=True)
    round_id = Column(Integer, ForeignKey("game_rounds.id"), nullable=False)
    selected_index = Column(Integer, nullable=False)  # 0, 1, or 2
    is_correct = Column(Boolean, nullable=False)
    attempt_number = Column(Integer, nullable=False, default=1)  # 1 or 2
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    round = relationship("GameRound", back_populates="guesses")
