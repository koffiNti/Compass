from typing import List
from datetime import date
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.api.deps import get_current_user
from app.domain.models.user import User
from app.services.metric_service import MetricService
from app.domain.schemas.metric_schema import (
    MetricDefinitionResponse,
    MetricDefinitionCreate,
    DailyMetricEntryResponse,
    DailyMetricsBatchLog
)

router = APIRouter(prefix="/metrics", tags=["Daily Metrics"])

@router.get("/definitions", response_model=List[MetricDefinitionResponse])
async def get_metric_definitions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MetricService(db)
    return await service.get_or_init_definitions(current_user.id)

@router.post("/definitions", response_model=MetricDefinitionResponse, status_code=status.HTTP_201_CREATED)
async def create_metric_definition(
    def_data: MetricDefinitionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MetricService(db)
    return await service.create_definition(current_user.id, def_data)

@router.get("/date/{entry_date}", response_model=List[DailyMetricEntryResponse])
async def get_daily_metrics(
    entry_date: date,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MetricService(db)
    return await service.get_daily_entries(current_user.id, entry_date)

@router.post("/log", response_model=List[DailyMetricEntryResponse])
async def log_batch_metrics(
    batch: DailyMetricsBatchLog,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MetricService(db)
    return await service.log_batch_metrics(current_user.id, batch)
