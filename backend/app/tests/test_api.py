from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.models.game import Image

# Test database
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
Base.metadata.create_all(bind=engine)

# Seed test data
db = TestSessionLocal()
real_img1 = Image(url="/test_real1.jpg", is_ai_generated=False, category="test")
real_img2 = Image(url="/test_real2.jpg", is_ai_generated=False, category="test")
ai_img = Image(url="/test_ai.jpg", is_ai_generated=True, category="test", hint="Test hint")
db.add_all([real_img1, real_img2, ai_img])
db.commit()
db.close()

client = TestClient(app)


def test_create_round():
    response = client.post("/rounds", json={"category": "test", "difficulty": "medium"})
    assert response.status_code == 200
    data = response.json()
    assert "round_id" in data
    assert len(data["images"]) == 3
    assert data["category"] == "test"


def test_submit_correct_guess():
    # Create round
    create_resp = client.post("/rounds", json={"category": "test"})
    round_id = create_resp.json()["round_id"]
    
    # Try all indices to find correct one
    for idx in range(3):
        guess_resp = client.post(f"/rounds/{round_id}/guess", json={"selected_index": idx})
        if guess_resp.json()["is_correct"]:
            assert guess_resp.json()["game_over"] is True
            break


def test_stats_endpoint():
    response = client.get("/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_rounds" in data
    assert "accuracy" in data

