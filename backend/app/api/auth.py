from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from ..core.database import get_db
from ..core.security import verify_password, get_password_hash, create_access_token, decode_token
from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserResponse, Token, UserStats

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    if user_data.email:
        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        display_name=user_data.display_name or user_data.username,
        hashed_password=hashed_password,
        last_login=datetime.utcnow()
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user.username})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(db_user)
    )


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": user.username})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return UserResponse.model_validate(current_user)


@router.get("/stats", response_model=UserStats)
def get_user_stats(current_user: User = Depends(get_current_user)):
    """Get current user statistics"""
    win_rate = (
        (current_user.games_won / current_user.total_games * 100)
        if current_user.total_games > 0
        else 0.0
    )
    
    average_score = (
        (current_user.total_score / current_user.total_games)
        if current_user.total_games > 0
        else 0.0
    )
    
    return UserStats(
        total_games=current_user.total_games,
        games_won=current_user.games_won,
        games_lost=current_user.games_lost,
        win_rate=round(win_rate, 2),
        total_score=current_user.total_score,
        best_time=current_user.best_time,
        average_score=round(average_score, 2)
    )


@router.put("/stats/update")
def update_user_stats(
    won: bool,
    score: int,
    time_taken: Optional[float] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user statistics after a game"""
    current_user.total_games += 1
    current_user.total_score += score
    
    if won:
        current_user.games_won += 1
    else:
        current_user.games_lost += 1
    
    # Update best time if applicable
    if time_taken is not None:
        if current_user.best_time is None or time_taken < current_user.best_time:
            current_user.best_time = time_taken
    
    db.commit()

    # Check for new achievements
    from ..services.achievement_service import AchievementService
    new_achievements = AchievementService.check_achievements(db, current_user.id)
    
    return {
        "message": "Statistics updated successfully",
        "new_achievements": new_achievements
    }

