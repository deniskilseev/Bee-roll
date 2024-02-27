from server import app
from fastapi.testclient import TestClient


def test_no_film_ids():
    with TestClient(app=app) as client:
        response = client.post("/movies", json={"user_id": 10})
        assert response.json()["status_code"] == 412

def test_film_number():
    json = {
        "user_id": 123,
        "movie_ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
    with TestClient(app=app) as client:
        response = client.post("/movies", json=json)
        movie_ids = response.json()["movie_ids"]
        assert len(movie_ids) == 50

def test_invalid_input():
    json = {
        "user_id": "Quentin Tarantino",
        "movie_ids": ["The Hateful Eight", "Django Unchained"]
    }
    with TestClient(app = app) as client:
        response = client.post("/movies", json=json)
        assert response.status_code == 422
