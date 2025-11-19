from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.models.leaderboard import LeaderboardEntry

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

client = TestClient(app)


def test_create_leaderboard_entry():
    response = client.post("/leaderboard", json={
        "player_name": "TestPlayer",
        "score": 5,
        "time_taken": 45.5,
        "game_mode": "timed",
        "category": "portrait"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["player_name"] == "TestPlayer"
    assert data["score"] == 5
    assert data["time_taken"] == 45.5


def test_get_leaderboard():
    # Create some entries
    for i in range(3):
        client.post("/leaderboard", json={
            "player_name": f"Player{i}",
            "score": i + 1,
            "time_taken": 30.0 + i,
            "game_mode": "timed"
        })
    
    response = client.get("/leaderboard?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    # Check ranking (highest score first)
    assert data[0]["rank"] == 1


def test_get_leaderboard_filtered():
    response = client.get("/leaderboard?game_mode=timed&limit=5")
    assert response.status_code == 200
    data = response.json()
    for entry in data:
        assert entry["game_mode"] == "timed"


def test_get_top_by_mode():
    response = client.get("/leaderboard/top/timed?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

