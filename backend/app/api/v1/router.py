from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.journal import router as journal_router
from app.api.v1.metrics import router as metrics_router
from app.api.v1.habits import router as habits_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.goals import router as goals_router
from app.api.v1.projects import router as projects_router
from app.api.v1.vault import router as vault_router
from app.api.v1.coach import router as coach_router
from app.api.v1.search import router as search_router
from app.api.v1.analytics import router as analytics_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(journal_router)
api_router.include_router(metrics_router)
api_router.include_router(habits_router)
api_router.include_router(dashboard_router)
api_router.include_router(goals_router)
api_router.include_router(projects_router)
api_router.include_router(vault_router)
api_router.include_router(coach_router)
api_router.include_router(search_router)
api_router.include_router(analytics_router)
