import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Date, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.db import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="active") # active, completed, on_hold
    technologies = Column(JSON, default=list)      # JSON array of tech strings e.g. ["Python", "FastAPI", "React"]
    repo_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    progress_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", backref="projects")


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    is_completed = Column(Boolean, default=False)
    target_date = Column(Date, nullable=True)

    project = relationship("Project", backref="milestones")


class ProjectNote(Base):
    __tablename__ = "project_notes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    content_markdown = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("Project", backref="notes")
