import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.db import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Goal(Base):
    __tablename__ = "goals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    parent_goal_id = Column(String(36), ForeignKey("goals.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    timeframe = Column(String(20), nullable=False, default="quarterly") # long_term, quarterly, monthly, weekly, daily
    target_date = Column(Date, nullable=True)
    progress_percentage = Column(Float, default=0.0)
    status = Column(String(20), default="in_progress") # in_progress, completed, paused, abandoned
    category = Column(String(50), nullable=True) # career, health, academics, finance
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", backref="goals")
    parent_goal = relationship("Goal", remote_side=[id], backref="sub_goals")


class GoalMilestone(Base):
    __tablename__ = "goal_milestones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    goal_id = Column(String(36), ForeignKey("goals.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    is_completed = Column(Boolean, default=False)
    due_date = Column(Date, nullable=True)

    goal = relationship("Goal", backref="milestones")
