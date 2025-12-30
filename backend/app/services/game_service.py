from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Tuple
from datetime import datetime
import random

from ..models.game import GameRound, Guess, Image
from ..models.scenario import Scenario
from ..models.game_mode import GameMode
from .openai_service import OpenAIService

def get_random_images(db: Session, category: Optional[str] = None, count: int = 3) -> List[Image]:
    """Get random images: 2 real + 1 AI-generated (Old Logic / Fallback)"""
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
        # If we don't have enough images, we might be in a fresh DB state.
        # This error is expected if not seeded.
        pass 
        
    return real_images + ai_images


def create_round(
    db: Session,
    category: Optional[str] = None,
    difficulty: str = "medium",
    game_mode: str = "classic",
    time_limit: Optional[int] = None
) -> GameRound:
    """Create a new game round with 3 images (Scenario + DALL-E preferred)"""
    
    # Fetch Game Rules from DB
    mode_rules = db.query(GameMode).filter(GameMode.name == game_mode).first()
    
    # Determine effective time limit
    effective_time_limit = time_limit
    if effective_time_limit is None and mode_rules:
        effective_time_limit = mode_rules.time_limit
    
    # 1. Try to fetch a random Scenario
    scenario_query = db.query(Scenario)
    if category:
        scenario_query = scenario_query.filter(Scenario.category == category)
    if difficulty:
         scenario_query = scenario_query.filter(Scenario.difficulty == difficulty)
         
    scenario = scenario_query.order_by(func.random()).first()
    
    images = []
    selected_scenario_id = None
    
    # 2. If Scenario exists, try to use it
    if scenario:
        # Get 2 real images for this scenario
        real_images = db.query(Image).filter(
            Image.scenario_id == scenario.id,
            Image.is_ai_generated == False
        ).order_by(func.random()).limit(2).all()
        
        if len(real_images) >= 2:
            # 1. Try to find existing AI image for this scenario (Pre-seeded)
            existing_ai_image = db.query(Image).filter(
                Image.scenario_id == scenario.id,
                Image.is_ai_generated == True
            ).first()
            
            if existing_ai_image:
                 ai_image = existing_ai_image
            else:
                # 2. Generate/Get AI Image if not found
                image_url = OpenAIService.generate_image(scenario.prompt_text)
                
                # Save generated image to DB
                ai_image = Image(
                    url=image_url,
                    is_ai_generated=True,
                    category=scenario.category,
                    difficulty=scenario.difficulty,
                    scenario_id=scenario.id,
                    hint="AI tarafından üretilmiştir." # Default hint, can be improved
                )
                db.add(ai_image)
                db.commit()
                db.refresh(ai_image)
            
            images = real_images + [ai_image]
            selected_scenario_id = scenario.id
            
    # 3. Fallback to random selection if no scenario or not enough real images for scenario
    if len(images) < 3:
        try:
            images = get_random_images(db, category, count=3)
            # Check validation inside get_random_images, but we need to re-verify here
            if len(images) < 3:
                 raise ValueError("Not enough images in database")
        except ValueError:
             raise ValueError("Not enough images in database and no valid scenario found.")

    
    # Shuffle to randomize AI image position
    random.shuffle(images)
    
    # Find AI image index
    ai_index = next(i for i, img in enumerate(images) if img.is_ai_generated)
    
    # Set start time if there is a time limit
    start_time = datetime.utcnow() if effective_time_limit else None
    
    round_obj = GameRound(
        ai_image_index=ai_index,
        image1_id=images[0].id,
        image2_id=images[1].id,
        image3_id=images[2].id,
        category=category,
        difficulty=difficulty,
        game_mode=game_mode,
        time_limit=effective_time_limit,
        start_time=start_time,
        scenario_id=selected_scenario_id,
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
    
    # Fetch Game Mode Rules for Max Lives
    # Default to 2 lives (classic) if mode not found
    mode_rules = db.query(GameMode).filter(GameMode.name == round_obj.game_mode).first()
    max_lives = mode_rules.max_lives if mode_rules else 2
    
    # Count existing guesses
    existing_guesses = db.query(Guess).filter(Guess.round_id == round_id).count()
    attempt_number = existing_guesses + 1
    
    if attempt_number > max_lives:
        # Should normally be caught by completed check, but safe guard
        round_obj.completed = True
        db.commit()
        return False, attempt_number, True, None
    
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
    # Game Over if: Correct Guess OR Max Attempts Reached
    game_over = is_correct or attempt_number >= max_lives
    
    if game_over:
        round_obj.completed = True
    
    # Get hint if wrong and still has lives
    hint = None
    if not is_correct and not game_over:
        # Check difficulty
        if round_obj.difficulty == "hard":
            hint = "Zor modda ipucu yok!"
        else:
            # Get the AI image to retrieve its hint
            ai_image_id = [round_obj.image1_id, round_obj.image2_id, round_obj.image3_id][round_obj.ai_image_index]
            ai_image = db.query(Image).filter(Image.id == ai_image_id).first()
            if ai_image and ai_image.hint:
                hint = ai_image.hint
            else:
                hint = "Detaylara dikkat edin: yüz simetrisi, arka plan tutarlılığı, gölgeler."
            
            if round_obj.difficulty == "easy":
                hint = f"KOLAY İPUCU: {hint}"
    
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

