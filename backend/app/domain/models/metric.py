import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.core.db import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class MetricDefinition(Base):
    __tablename__ = "metric_definitions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    key = Column(String(50), nullable=False)            # e.g., 'coding_minutes', 'lecture_attendance'
    label = Column(String(100), nullable=False)          # e.g., 'Coding Time', 'Lecture Attendance'
    unit = Column(String(20), nullable=True)             # e.g., 'mins', 'boolean', 'glasses', 'rating'
    metric_type = Column(String(20), nullable=False)     # 'numeric', 'boolean', 'rating', 'text'
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", backref="metric_definitions")


class DailyMetricEntry(Base):
    __tablename__ = "daily_metrics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    metric_id = Column(String(36), ForeignKey("metric_definitions.id", ondelete="CASCADE"), nullable=False)
    numeric_value = Column(Float, nullable=True)
    boolean_value = Column(Boolean, nullable=True)
    string_value = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    metric = relationship("MetricDefinition", backref="daily_entries")
    user = relationship("User", backref="daily_metrics")
