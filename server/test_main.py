from fastapi.testclient import TestClient
from main import app
import pytest

# Fixture: Creates a fresh client for each test.
# The 'with' context manager triggers the @app.on_event("startup") in main.py
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

TEST_USER = {"username": "unit_tester", "password": "password123"}


def get_auth_headers(client):
    """Helper to register, login, and get token"""
    # 1. Try Register (ignore if exists)
    client.post("/register", json=TEST_USER)

    # 2. Login
    login_res = client.post("/token", data=TEST_USER)
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_health_check(client):
    """Ensure server is running"""
    response = client.get("/")
    assert response.status_code == 404


def test_create_task(client):
    """Test creating a task with Auth"""
    headers = get_auth_headers(client)
    response = client.post("/tasks", json={"title": "Test Task", "priority": 1}, headers=headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Test Task"
    assert response.json()["priority"] == 1


def test_get_tasks(client):
    """Test fetching tasks list"""
    headers = get_auth_headers(client)
    response = client.get("/tasks", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_task(client):
    """Test soft-delete mechanism"""
    headers = get_auth_headers(client)
    # Create temp task
    create_res = client.post("/tasks", json={"title": "Delete Me"}, headers=headers)
    task_id = create_res.json()["_id"]

    # Delete it
    del_res = client.delete(f"/tasks/{task_id}", headers=headers)
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True
