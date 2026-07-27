from typing import Optional, List, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict

class AIReviewRequest(BaseModel):
    review_type: str = "daily_summary" # daily_summary, weekly_review, monthly_review
    target_date: Optional[date] = None

class AIReviewResponse(BaseModel):
    id: str
    user_id: str
    review_type: str
    period_start: date
    period_end: date
    summary_markdown: str
    insights: Dict[str, Any]
    action_items: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AICoachPrompt(BaseModel):
    question: str
    conversation_id: Optional[str] = None

class AIMessageResponse(BaseModel):
    id: str
    sender: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIUniversalSearchResponse(BaseModel):
    query: str
    matches: List[Dict[str, Any]]
