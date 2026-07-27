from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.services.auth_service import AuthService
from app.domain.schemas.user_schema import (
    UserCreate,
    UserLogin,
    TokenResponse,
    UserResponse,
    RefreshTokenRequest,
    UserPreferenceBase,
    UserPreferenceResponse,
    AITestKeyRequest
)
from app.domain.models.user import User
from app.api.deps import get_current_user
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    return await auth_service.register_user(user_data)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    return await auth_service.login_user(credentials)

@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    return await auth_service.refresh_access_token(request.refresh_token)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.put("/preferences", response_model=UserPreferenceResponse)
async def update_preferences(
    prefs: UserPreferenceBase,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = UserRepository(db)
    updated = await repo.update_preferences(current_user.id, prefs.model_dump(exclude_unset=True))
    return UserPreferenceResponse.model_validate(updated)

@router.post("/test-ai-key")
async def test_ai_key(
    req: AITestKeyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.services.ai_coach_service import AICoachService
    service = AICoachService(db)
    return await service.test_ai_key(
        provider=req.provider,
        model=req.model,
        api_key=req.api_key,
        custom_base_url=req.custom_base_url
    )
