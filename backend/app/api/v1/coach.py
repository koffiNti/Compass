from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.api.deps import get_current_user
from app.domain.models.user import User
from app.services.ai_coach_service import AICoachService
from app.domain.schemas.ai_schema import (
    AIReviewRequest,
    AIReviewResponse,
    AICoachPrompt,
    AIMessageResponse
)

router = APIRouter(prefix="/coach", tags=["AI Coach"])

@router.post("/review", response_model=AIReviewResponse, status_code=status.HTTP_201_CREATED)
async def generate_review(
    req: AIReviewRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AICoachService(db)
    return await service.generate_review(current_user.id, req.review_type, req.target_date)

@router.post("/chat", response_model=AIMessageResponse)
async def chat_with_coach(
    prompt: AICoachPrompt,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AICoachService(db)
    return await service.ask_coach(current_user.id, prompt.question, prompt.conversation_id)
