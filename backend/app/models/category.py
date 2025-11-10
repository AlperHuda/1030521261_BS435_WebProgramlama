from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from ..core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    display_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)  # For future UI enhancement
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

