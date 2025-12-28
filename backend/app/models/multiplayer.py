from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from ..core.database import Base

class Lobby(Base):
    __tablename__ = "lobbies"

    id = Column(String(6), primary_key=True, index=True) # 6 character unique code
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="WAITING", nullable=False) # WAITING, PLAYING, FINISHED
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Current round info (syncing game state)
    current_round_number = Column(Integer, default=0)
    
    # Relationships
    host = relationship("User", foreign_keys=[host_id])
    players = relationship("LobbyPlayer", back_populates="lobby", cascade="all, delete-orphan")


class LobbyPlayer(Base):
    __tablename__ = "lobby_players"

    id = Column(Integer, primary_key=True, index=True)
    lobby_id = Column(String(6), ForeignKey("lobbies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_ready = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    lobby = relationship("Lobby", back_populates="players")
    user = relationship("User")
