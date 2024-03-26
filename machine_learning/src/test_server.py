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

def test_similar_films():
    json = {
        "movieId": 1,
        "rating": 3.0
    }
    with TestClient(app=app) as client:
        response = client.post("/similarMovies", json=json)
        assert len(response.json()["movie_ids"]) == 50


def test_updating_user():
    json = {
        "userId": 123,
        "reviews": [{"movieId": 1, "rating": 3}, {"movieId": 2, "rating": 3},
                    {"movieId": 3, "rating": 3}, {"movieId": 4, "rating": 3},
                    {"movieId": 5, "rating": 3}, {"movieId": 6, "rating": 3},
                    {"movieId": 7, "rating": 3}, {"movieId": 8, "rating": 3},
                    {"movieId": 9, "rating": 3}, {"movieId": 10, "rating": 3}]
    }
    with TestClient(app=app) as client:
        response = client.post("/updateUser", json=json)
        assert response.status_code == 200
        response = client.post("/predictUser", json=json)
        assert len(response.json()["movie_ids"]) != 0
        json["reviews"] = []
        response = client.post("/updateUser", json=json)
        assert response.status_code == 200

