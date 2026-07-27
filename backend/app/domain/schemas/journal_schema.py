from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict

class JournalEntryBase(BaseModel):
    date: date
    mood_score: int = Field(default=5, ge=1, le=10)
    energy_score: int = Field(default=5, ge=1, le=10)
    content_markdown: str = ""
    wins: Optional[str] = None
    challenges: Optional[str] = None
    lessons: Optional[str] = None
    gratitude: Optional[str] = None
    tomorrow_goals: Optional[str] = None
    tags: List[str] = Field(default_factory=list)

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryUpdate(BaseModel):
    mood_score: Optional[int] = Field(None, ge=1, le=10)
    energy_score: Optional[int] = Field(None, ge=1, le=10)
    content_markdown: Optional[str] = None
    wins: Optional[str] = None
    challenges: Optional[str] = None
    lessons: Optional[str] = None
    gratitude: Optional[str] = None
    tomorrow_goals: Optional[str] = None
    tags: Optional[List[str]] = None

class JournalEntryResponse(JournalEntryBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
