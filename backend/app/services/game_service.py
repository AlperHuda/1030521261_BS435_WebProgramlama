from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Tuple
import random

from ..models.game import GameRound, Guess, Image


def get_random_images(db: Session, category: Optional[str] = None, count: int = 3) -> List[Image]:
    """Get random images: 2 real + 1 AI-generated"""
    query = db.query(Image)
    
    if category:
        query = query.filter(Image.category == category)
    
    # Get 2 real images
    real_images = query.filter(Image.is_ai_generated == False).order_by(func.random()).limit(2).all()
    
    # Get 1 AI image
    ai_query = db.query(Image).filter(Image.is_ai_generated == True)
    if category:
        ai_query = ai_query.filter(Image.category == category)
    ai_images = ai_query.order_by(func.random()).limit(1).all()
    
    if len(real_images) < 2 or len(ai_images) < 1:
        raise ValueError("Not enough images in database")
    
    return real_images + ai_images


def create_round(db: Session, category: Optional[str] = None, difficulty: str = "medium") -> GameRound:
    """Create a new game round with 3 random images"""
    images = get_random_images(db, category, count=3)
    
    # Shuffle to randomize AI image position
    random.shuffle(images)
    
    # Find AI image index
    ai_index = next(i for i, img in enumerate(images) if img.is_ai_generated)
    
    round_obj = GameRound(
        ai_image_index=ai_index,
        image1_id=images[0].id,
        image2_id=images[1].id,
        image3_id=images[2].id,
        category=category,
        difficulty=difficulty,
        completed=False
    )
    
    db.add(round_obj)
    db.commit()
    db.refresh(round_obj)
    
    return round_obj


def evaluate_guess(db: Session, round_id: int, selected_index: int) -> Tuple[bool, int, bool, Optional[str]]:
    """
    Evaluate a guess and return:
    - is_correct: bool
    - attempt_number: int
    - game_over: bool
    - hint: Optional[str]
    """
    round_obj = db.query(GameRound).filter(GameRound.id == round_id).first()
    if not round_obj:
        raise ValueError("Round not found")
    
    if round_obj.completed:
        raise ValueError("Round already completed")
    
    # Count existing guesses
    existing_guesses = db.query(Guess).filter(Guess.round_id == round_id).count()
    attempt_number = existing_guesses + 1
    
    if attempt_number > 2:
        raise ValueError("Maximum attempts exceeded")
    
    is_correct = selected_index == round_obj.ai_image_index
    
    # Create guess record
    guess = Guess(
        round_id=round_id,
        selected_index=selected_index,
        is_correct=is_correct,
        attempt_number=attempt_number
    )
    db.add(guess)
    
    # Determine game state
    game_over = is_correct or attempt_number >= 2
    
    if game_over:
        round_obj.completed = True
    
    # Get hint if first attempt was wrong
    hint = None
    if not is_correct and attempt_number == 1:
        # Get the AI image to retrieve its hint
        ai_image_id = [round_obj.image1_id, round_obj.image2_id, round_obj.image3_id][round_obj.ai_image_index]
        ai_image = db.query(Image).filter(Image.id == ai_image_id).first()
        if ai_image and ai_image.hint:
            hint = ai_image.hint
        else:
            hint = "Detaylara dikkat edin: yüz simetrisi, arka plan tutarlılığı, gölgeler."
    
    db.commit()
    
    return is_correct, attempt_number, game_over, hint


def get_stats(db: Session) -> dict:
    """Get overall game statistics"""
    total_rounds = db.query(GameRound).filter(GameRound.completed == True).count()
    total_guesses = db.query(Guess).count()
    
    correct_first = db.query(Guess).filter(
        Guess.is_correct == True,
        Guess.attempt_number == 1
    ).count()
    
    correct_second = db.query(Guess).filter(
        Guess.is_correct == True,
        Guess.attempt_number == 2
    ).count()
    
    failed = total_rounds - (correct_first + correct_second)
    accuracy = (correct_first + correct_second) / total_rounds if total_rounds > 0 else 0.0
    
    return {
        "total_rounds": total_rounds,
        "total_guesses": total_guesses,
        "correct_first_attempt": correct_first,
        "correct_second_attempt": correct_second,
        "failed": failed,
        "accuracy": round(accuracy, 2)
    }

