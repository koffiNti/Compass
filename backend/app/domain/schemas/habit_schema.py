from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict

class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "general"
    frequency: str = "daily"
    target_count: int = 1

class HabitCreate(HabitBase):
    pass

class HabitResponse(HabitBase):
    id: str
    user_id: str
    is_archived: bool
    created_at: datetime
    current_streak: Optional[int] = 0
    longest_streak: Optional[int] = 0
    completed_today: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)


class HabitLogBase(BaseModel):
    habit_id: str
    date: date
    completed: bool = True
    notes: Optional[str] = None

class HabitLogCreate(HabitLogBase):
    pass

class HabitLogResponse(HabitLogBase):
    id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
