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
from .models import multiplayer  # Ensure Lobby tables are registered before create_all


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
        from .scripts.seed_categories import seed_categories
        from .scripts.migrate_db import migrate_db
        
        print("--- Startup Sequence Initiated ---")
        
        # 1. Database Migration
        try:
            print("1. Checking DB Schema...")
            migrate_db()
        except Exception as e:
            print(f"Warning: Migration script failed (might be first run): {e}")

        # 2. Seeding
        print("2. Verifying Game Data...")
        db = SessionLocal()
        try:
             # Basic Categories (essential)
            seed_categories(db)
            
            # Game Modes (essential - auto cleaning logic handled in logic or manual DB reset if needed)
            seed_game_modes(db)

            # 3. Content Seeding
            # Check if we have any real images or if AI images are missing
            image_count = db.query(Image).filter(Image.is_ai_generated == False).count()
            ai_image_count = db.query(Image).filter(Image.is_ai_generated == True).count()
            
            if image_count < 10 or ai_image_count < 10:
                print(f"Content missing (Real: {image_count}, AI: {ai_image_count}). Starting advanced seeding...")
                print("This ensures you have 20 scenarios with Real + AI images.")
                seed_advanced(db)
            else:
                print(f"Seeding skipped: Sufficient data found (Real: {image_count}, AI: {ai_image_count}).")
                
        except Exception as e:
            print(f"Startup seeding failed: {e}")
        finally:
            db.close()
        
        print("--- Startup Sequence Complete ---")

    return app


app = create_app()
