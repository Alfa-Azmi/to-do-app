import pytest
from unittest.mock import patch, MagicMock
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app

@pytest.fixture
def client():
    return app.test_client()

# Test GET /tasks
def test_get_tasks(client):
    fake_tasks = [(1, "Task1", "Desc1"), (2, "Task2", "Desc2")]
    
    # Mock get_db_connection and cursor
    with patch("app.get_db_connection") as mock_conn:
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = fake_tasks
        mock_conn.return_value.cursor.return_value = mock_cursor
        
        response = client.get("/tasks")
        data = response.get_json()
        
        assert response.status_code == 200
        assert data == [
            {"id": 1, "title": "Task1", "description": "Desc1"},
            {"id": 2, "title": "Task2", "description": "Desc2"},
        ]

# Test POST /tasks
def test_create_task(client):
    fake_cursor = MagicMock()
    fake_cursor.fetchone.return_value = [1]

    with patch("app.get_db_connection") as mock_conn:
        mock_conn.return_value.cursor.return_value = fake_cursor
        mock_conn.return_value.commit.return_value = None
        mock_conn.return_value.cursor.return_value.close.return_value = None
        mock_conn.return_value.close.return_value = None

        response = client.post("/tasks", json={"title": "New Task", "description": "Desc"})
        data = response.get_json()
        
        assert response.status_code == 201
        assert data["id"] == 1
        assert data["title"] == "New Task"
        assert data["description"] == "Desc"

# Test POST /tasks/<id>/complete
def test_complete_task(client):
    fake_cursor = MagicMock()
    fake_cursor.rowcount = 1  # Simulate existing row

    with patch("app.get_db_connection") as mock_conn:
        mock_conn.return_value.cursor.return_value = fake_cursor
        mock_conn.return_value.commit.return_value = None
        mock_conn.return_value.cursor.return_value.close.return_value = None
        mock_conn.return_value.close.return_value = None

        response = client.post("/tasks/1/complete")
        data = response.get_json()

        assert response.status_code == 200
        assert data["message"] == "Task marked as complete"