import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, DateTime, Date, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.db import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class AIReview(Base):
    __tablename__ = "ai_reviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    review_type = Column(String(20), nullable=False) # daily_summary, weekly_review, monthly_review
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    summary_markdown = Column(Text, nullable=False)
    insights = Column(JSON, nullable=False, default=dict)
    action_items = Column(JSON, nullable=True, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", backref="ai_reviews")


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", backref="ai_conversations")


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(20), nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    conversation = relationship("AIConversation", backref="messages")
