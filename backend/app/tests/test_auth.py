from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db

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


def test_register_user():
    response = client.post("/auth/register", json={
        "username": "testuser",
        "password": "testpass123",
        "email": "test@example.com",
        "display_name": "Test User"
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "testuser"


def test_register_duplicate_username():
    # First registration
    client.post("/auth/register", json={
        "username": "duplicate",
        "password": "pass123",
    })
    
    # Try to register again
    response = client.post("/auth/register", json={
        "username": "duplicate",
        "password": "pass456",
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_login():
    # Register first
    client.post("/auth/register", json={
        "username": "logintest",
        "password": "pass123",
    })
    
    # Login
    response = client.post("/auth/login", json={
        "username": "logintest",
        "password": "pass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


def test_login_wrong_password():
    # Register first
    client.post("/auth/register", json={
        "username": "wrongpass",
        "password": "correctpass",
    })
    
    # Try wrong password
    response = client.post("/auth/login", json={
        "username": "wrongpass",
        "password": "wrongpass"
    })
    assert response.status_code == 401


def test_get_me():
    # Register and get token
    reg_response = client.post("/auth/register", json={
        "username": "metest",
        "password": "pass123",
    })
    token = reg_response.json()["access_token"]
    
    # Get user info
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "metest"


def test_get_stats():
    # Register and get token
    reg_response = client.post("/auth/register", json={
        "username": "statstest",
        "password": "pass123",
    })
    token = reg_response.json()["access_token"]
    
    # Get stats
    response = client.get(
        "/auth/stats",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_games"] == 0
    assert data["win_rate"] == 0.0


def test_update_stats():
    # Register and get token
    reg_response = client.post("/auth/register", json={
        "username": "updatestats",
        "password": "pass123",
    })
    token = reg_response.json()["access_token"]
    
    # Update stats
    response = client.put(
        "/auth/stats/update?won=true&score=1&time_taken=45.5",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    
    # Check updated stats
    stats_response = client.get(
        "/auth/stats",
        headers={"Authorization": f"Bearer {token}"}
    )
    data = stats_response.json()
    assert data["total_games"] == 1
    assert data["games_won"] == 1
    assert data["best_time"] == 45.5

