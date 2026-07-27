from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.api.deps import get_current_user
from app.domain.models.user import User
from app.services.vault_service import VaultService
from app.domain.schemas.vault_schema import (
    VaultItemCreate,
    VaultItemResponse,
    VaultSearchResult
)

router = APIRouter(prefix="/vault", tags=["Knowledge Vault RAG"])

@router.get("", response_model=List[VaultItemResponse])
async def list_vault_items(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = VaultService(db)
    return await service.list_items(current_user.id)

@router.post("", response_model=VaultItemResponse, status_code=status.HTTP_201_CREATED)
async def create_vault_item(
    item_data: VaultItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = VaultService(db)
    return await service.create_item(current_user.id, item_data)

@router.get("/search", response_model=List[VaultSearchResult])
async def search_vault(
    q: str = Query(min_length=1),
    limit: int = Query(default=10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = VaultService(db)
    return await service.search_vault(current_user.id, query=q, limit=limit)
