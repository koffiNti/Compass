import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.db import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    mood_score = Column(Integer, default=5)      # 1 to 10 scale
    energy_score = Column(Integer, default=5)    # 1 to 10 scale
    content_markdown = Column(Text, nullable=False, default="")
    wins = Column(Text, nullable=True)
    challenges = Column(Text, nullable=True)
    lessons = Column(Text, nullable=True)
    gratitude = Column(Text, nullable=True)
    tomorrow_goals = Column(Text, nullable=True)
    tags = Column(JSON, default=list)            # JSON list of tag strings
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", backref="journal_entries")
