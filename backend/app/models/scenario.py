from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..core.database import Base

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    prompt_text = Column(String(1000), nullable=False)
    category = Column(String(50), nullable=False)
    difficulty = Column(String(20), default="medium")
    
    # Relationship to images (real images associated with this scenario)
    images = relationship("Image", back_populates="scenario")
