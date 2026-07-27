from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.api.deps import get_current_user
from app.domain.models.user import User
from app.services.goal_service import GoalService
from app.domain.schemas.goal_schema import (
    GoalCreate,
    GoalResponse,
    GoalMilestoneResponse
)

router = APIRouter(prefix="/goals", tags=["Goals Hierarchy"])

@router.get("", response_model=List[GoalResponse])
async def list_goals(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    return await service.list_goals(current_user.id)

@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal_data: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    return await service.create_goal(current_user.id, goal_data)

@router.post("/{goal_id}/milestones", response_model=GoalMilestoneResponse)
async def add_milestone(
    goal_id: str,
    title: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    return await service.add_milestone(goal_id, title)
