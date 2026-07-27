from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict

class GoalMilestoneBase(BaseModel):
    title: str
    is_completed: bool = False
    due_date: Optional[date] = None

class GoalMilestoneCreate(GoalMilestoneBase):
    pass

class GoalMilestoneResponse(GoalMilestoneBase):
    id: str
    goal_id: str

    model_config = ConfigDict(from_attributes=True)


class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    timeframe: str = "quarterly" # long_term, quarterly, monthly, weekly, daily
    target_date: Optional[date] = None
    progress_percentage: float = 0.0
    status: str = "in_progress"
    category: Optional[str] = None
    parent_goal_id: Optional[str] = None

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    milestones: List[GoalMilestoneResponse] = []
    sub_goals: List["GoalResponse"] = []

    model_config = ConfigDict(from_attributes=True)
