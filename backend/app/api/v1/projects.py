from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.api.deps import get_current_user
from app.domain.models.user import User
from app.services.project_service import ProjectService
from app.domain.schemas.project_schema import (
    ProjectCreate,
    ProjectResponse,
    ProjectMilestoneResponse,
    ProjectNoteResponse
)

router = APIRouter(prefix="/projects", tags=["Software Projects"])

@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProjectService(db)
    return await service.list_projects(current_user.id)

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProjectService(db)
    return await service.create_project(current_user.id, project_data)

@router.post("/{project_id}/milestones", response_model=ProjectMilestoneResponse)
async def add_milestone(
    project_id: str,
    title: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProjectService(db)
    return await service.add_milestone(project_id, title)

@router.post("/{project_id}/notes", response_model=ProjectNoteResponse)
async def add_note(
    project_id: str,
    title: str,
    content: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProjectService(db)
    return await service.add_note(project_id, title, content)
