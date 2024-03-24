from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager
from config import PATH_TO_MOVIE_MODEL, PATH_TO_MOVIE_ENCODER, MIN_PREDICT_MOVIES
from typing import List, Union
import joblib
from dummy_model import DummyModel
from utils import MovieEncoder, make_coo_row

ml_models = {}
movie_encoder = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    with open(PATH_TO_MOVIE_MODEL, "rb") as file:
        ml_models["popularMovies"] = joblib.load(file)
    with open(PATH_TO_MOVIE_ENCODER, "rb") as file:
        movie_encoder = joblib.load(file)
    # Add other models afterward
    yield
    # Clean up the ML models and release the resources
    ml_models.clear()


app = FastAPI(lifespan=lifespan)

class Movie(BaseModel):
    movie_id: int
    review: float

class History(BaseModel):
    user_id: int
    reviews: List[Movie] = []

@app.post("/movies")
async def popular_movies(history: History):
    if len(history.reviews) < MIN_PREDICT_MOVIES:
        return HTTPException(status_code=412, detail="Provide more movie IDs")
    output = ml_models["popularMovies"].predict(history.reviews)
    return {
        "movie_ids": list(output)
    }

@app.post("/user")
async def user_recommendations(history: History):
    if len(history.reviews) < MIN_PREDICT_MOVIES:
        return HTTPException(status_code=412, detail="Provide more movie IDs")
    model_update(history.user_id, history.reviews)
    output = ml_models["userToUser"].predict(history.user_id)
    return {
            "movie_ids": list(output)
    }


@app.post("/updateUser")
async def update_user(history: History):
    if len(history.reviews) < MIN_PREDICT_MOVIES:
        return HTTPException(status_code=412, detail="Provide more movie IDs")
    model_update(history.user_id, history.reviews)

async def model_update(user_id, reviews, status_code=200):
    ml_models["userToUser"].update(user_id, make_coo_row(reviews, movie_encoder))
