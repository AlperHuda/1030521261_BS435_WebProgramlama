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

    # Static Files
    from fastapi.staticfiles import StaticFiles
    import os
    
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    if not os.path.exists(static_dir):
        os.makedirs(static_dir)
        
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

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
    
    from .api.multiplayer import router as multiplayer_router
    app.include_router(multiplayer_router)
    
    @app.on_event("startup")
    def startup_seed():
        from .core.database import SessionLocal
        from .models.game import Image
        from .scripts.seed_advanced import seed_advanced
        from .scripts.seed_game_modes import seed_game_modes
        
        print("Checking database state for seeding...")
        db = SessionLocal()
        try:
            # Seed Game Modes (always check/add missing modes)
            seed_game_modes(db)

            # Check if we have any real images
            image_count = db.query(Image).filter(Image.is_ai_generated == False).count()
            if image_count == 0:
                print("No real images found (fresh install?). Starting automatic advanced seeding...")
                print("This may take a few minutes as we download high-quality images...")
                seed_advanced(db)
            else:
                print(f"Skipping seeding: Found {image_count} existing real images.")
        except Exception as e:
            print(f"Startup seeding check failed: {e}")
        finally:
            db.close()

    return app


app = create_app()
