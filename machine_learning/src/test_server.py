from server import app
from fastapi.testclient import TestClient


def test_no_film_ids():
    with TestClient(app=app) as client:
        response = client.post("/popularMovies", json={"userId": 10})
        assert response.json()["status_code"] == 412

def test_film_number():
    json = {
        "userId": 123,
        "reviews": [{"movieId": 1, "rating": 3}, {"movieId": 2, "rating": 3},
                    {"movieId": 3, "rating": 3}, {"movieId": 4, "rating": 3},
                    {"movieId": 5, "rating": 3}, {"movieId": 6, "rating": 3},
                    {"movieId": 7, "rating": 3}, {"movieId": 8, "rating": 3},
                    {"movieId": 9, "rating": 3}, {"movieId": 10, "rating": 3}]
    }
    with TestClient(app=app) as client:
        response = client.post("/popularMovies", json=json)
        movie_ids = response.json()["movie_ids"]
        assert len(movie_ids) == 50

def test_invalid_input():
    json = {
        "user_id": "Quentin Tarantino",
        "movie_ids": ["The Hateful Eight", "Django Unchained"]
    }
    with TestClient(app=app) as client:
        response = client.post("/popularMovies", json=json)
        assert response.status_code == 422

