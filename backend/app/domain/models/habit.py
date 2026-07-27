import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Date, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from app.core.db import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Habit(Base):
    __tablename__ = "habits"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), default="general") # health, study, coding, mindfulness, trading
    frequency = Column(String(20), default="daily") # daily, weekdays, weekly
    target_count = Column(Integer, default=1)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", backref="habits")


class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    habit_id = Column(String(36), ForeignKey("habits.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    completed = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    habit = relationship("Habit", backref="logs")
    user = relationship("User", backref="habit_logs")
