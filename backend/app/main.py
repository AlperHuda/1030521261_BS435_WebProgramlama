from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .api.routes import router
from .api.categories import router as categories_router
from .api.leaderboard import router as leaderboard_router
from .api.auth import router as auth_router
from .api.achievements import router as achievements_router
from .core.config import settings
from .core.database import Base, engine


limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)
    app = FastAPI(title=settings.app_name)
    
    # Rate Limiting setup
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(router)
    app.include_router(categories_router)
    app.include_router(leaderboard_router)
    app.include_router(auth_router)
    app.include_router(achievements_router, prefix="/achievements", tags=["achievements"])
    return app


app = create_app()
