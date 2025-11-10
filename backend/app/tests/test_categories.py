from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.models.category import Category
from app.models.game_mode import GameMode

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
category1 = Category(name="portrait", display_name="Portre", description="Test portraits")
category2 = Category(name="landscape", display_name="Manzara", description="Test landscapes")
mode1 = GameMode(name="classic", display_name="Klasik Mod", description="Classic", is_active=True)
mode2 = GameMode(name="timed", display_name="Zamana Karşı", description="Timed", is_active=True)
db.add_all([category1, category2, mode1, mode2])
db.commit()
db.close()

client = TestClient(app)


def test_list_categories():
    response = client.get("/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert any(c["name"] == "portrait" for c in data)


def test_list_game_modes():
    response = client.get("/categories/modes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert all(mode["is_active"] for mode in data)


def test_get_category_stats():
    response = client.get("/categories/portrait/stats")
    assert response.status_code == 200
    data = response.json()
    assert "category" in data
    assert "total_images" in data


def test_get_nonexistent_category_stats():
    response = client.get("/categories/nonexistent/stats")
    assert response.status_code == 404

