from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.api.deps import get_current_user
from app.domain.models.user import User
from app.services.ai_search_service import AISearchService

router = APIRouter(prefix="/search", tags=["AI Universal Search"])

@router.get("/universal")
async def universal_search(
    q: str = Query(min_length=1),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AISearchService(db)
    matches = await service.universal_search(current_user.id, q)
    return {"query": q, "count": len(matches), "results": matches}
