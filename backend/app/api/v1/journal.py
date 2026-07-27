from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.api.deps import get_current_user
from app.domain.models.user import User
from app.services.journal_service import JournalService
from app.domain.schemas.journal_schema import JournalEntryCreate, JournalEntryResponse

router = APIRouter(prefix="/journal", tags=["Daily Journal"])

@router.get("/date/{entry_date}", response_model=Optional[JournalEntryResponse])
async def get_journal_by_date(
    entry_date: date,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    return await service.get_entry_by_date(current_user.id, entry_date)

@router.get("", response_model=List[JournalEntryResponse])
async def list_journal_entries(
    limit: int = Query(default=30, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    return await service.list_journal_entries(current_user.id, limit=limit)

@router.post("", response_model=JournalEntryResponse, status_code=status.HTTP_201_CREATED)
async def save_journal_entry(
    entry_data: JournalEntryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    return await service.save_journal_entry(current_user.id, entry_data)
