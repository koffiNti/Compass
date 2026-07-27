from fastapi import FastAPI
import logging

logger = logging.getLogger("uvicorn.error")


def create_app() -> FastAPI:
    app = FastAPI(title="Compass")
    try:
        # Attempt to include the v1 router if present
        from app.api.v1.router import router as api_router  # type: ignore

        app.include_router(api_router, prefix="/api/v1")
    except Exception as e:
        logger.warning("Could not include api.v1.router: %s", e)
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
