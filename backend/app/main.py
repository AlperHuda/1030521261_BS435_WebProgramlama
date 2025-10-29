from fastapi import FastAPI

from .api.routes import router
from .core.config import settings
from .core.database import Base, engine


def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)
    app = FastAPI(title=settings.app_name)
    app.include_router(router)
    return app


app = create_app()
