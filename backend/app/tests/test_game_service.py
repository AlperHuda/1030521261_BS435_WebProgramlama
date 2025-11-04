import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.models.game import Image, GameRound, Guess
from app.services.game_service import create_round, evaluate_guess, get_stats


# Test database setup
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = TestSessionLocal()
    
    # Seed test data
    real_img1 = Image(url="/real1.jpg", is_ai_generated=False, category="portrait")
    real_img2 = Image(url="/real2.jpg", is_ai_generated=False, category="portrait")
    ai_img = Image(url="/ai.jpg", is_ai_generated=True, category="portrait", hint="Check the eyes")
    
    session.add_all([real_img1, real_img2, ai_img])
    session.commit()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(bind=engine)


def test_create_round(db):
    round_obj = create_round(db, category="portrait")
    
    assert round_obj.id is not None
    assert round_obj.ai_image_index in [0, 1, 2]
    assert round_obj.category == "portrait"
    assert round_obj.completed is False


def test_evaluate_guess_correct_first_attempt(db):
    round_obj = create_round(db, category="portrait")
    
    is_correct, attempt, game_over, hint = evaluate_guess(db, round_obj.id, round_obj.ai_image_index)
    
    assert is_correct is True
    assert attempt == 1
    assert game_over is True
    assert hint is None


def test_evaluate_guess_wrong_first_attempt(db):
    round_obj = create_round(db, category="portrait")
    wrong_index = (round_obj.ai_image_index + 1) % 3
    
    is_correct, attempt, game_over, hint = evaluate_guess(db, round_obj.id, wrong_index)
    
    assert is_correct is False
    assert attempt == 1
    assert game_over is False
    assert hint is not None


def test_evaluate_guess_correct_second_attempt(db):
    round_obj = create_round(db, category="portrait")
    wrong_index = (round_obj.ai_image_index + 1) % 3
    
    # First wrong guess
    evaluate_guess(db, round_obj.id, wrong_index)
    
    # Second correct guess
    is_correct, attempt, game_over, hint = evaluate_guess(db, round_obj.id, round_obj.ai_image_index)
    
    assert is_correct is True
    assert attempt == 2
    assert game_over is True


def test_get_stats(db):
    # Create and complete a round
    round_obj = create_round(db, category="portrait")
    evaluate_guess(db, round_obj.id, round_obj.ai_image_index)
    
    stats = get_stats(db)
    
    assert stats["total_rounds"] == 1
    assert stats["correct_first_attempt"] == 1
    assert stats["accuracy"] == 1.0

