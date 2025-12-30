from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class GameMode(Base):
    __tablename__ = "game_modes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    display_name = Column(String)
    description = Column(String)
    icon = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Game Rules
    time_limit = Column(Integer, nullable=True) # Seconds, None for unlimited
    max_lives = Column(Integer, default=3)      # Number of wrong guesses allowed
    total_rounds = Column(Integer, nullable=True) # Number of rounds, None for infinite
    vote_seconds = Column(Integer, nullable=True) # For multiplayer voting time
