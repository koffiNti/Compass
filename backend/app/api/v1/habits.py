from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.api.deps import get_current_user
from app.domain.models.user import User
from app.services.habit_service import HabitService
from app.domain.schemas.habit_schema import (
    HabitCreate,
    HabitResponse,
    HabitLogCreate,
    HabitLogResponse
)

router = APIRouter(prefix="/habits", tags=["Habit Tracker"])

@router.get("", response_model=List[HabitResponse])
async def list_habits(
    check_date: Optional[date] = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = HabitService(db)
    return await service.list_user_habits(current_user.id, check_date)

@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    habit_data: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = HabitService(db)
    return await service.create_habit(current_user.id, habit_data)

@router.post("/log", response_model=HabitLogResponse)
async def toggle_habit_log(
    log_data: HabitLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = HabitService(db)
    return await service.toggle_habit(current_user.id, log_data)
