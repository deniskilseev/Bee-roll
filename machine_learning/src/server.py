from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
import pickle
from contextlib import asynccontextmanager
from config import PATH_TO_POPULAR_MOVIES_MODEL, PATH_TO_ALS_MODEL, PATH_TO_MOVIE_ENCODER, MIN_PREDICT_MOVIES
from typing import List, Union
import joblib
from models import PopularMovies, ALS
from utils import MovieEncoder, make_coo_row

ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    with open(PATH_TO_POPULAR_MOVIES_MODEL, "rb") as file:
        ml_models["popularMovies"] = joblib.load(file)
    with open(PATH_TO_ALS_MODEL, "rb") as file:
        ml_models["als"] = joblib.load(file)
    with open(PATH_TO_MOVIE_ENCODER, "rb") as file:
        ml_models["encoder"] = joblib.load(file)
    # Add other models afterward
    yield
    # Clean up the ML models and release the resources
    with open(PATH_TO_ALS_MODEL, "wb") as file:
        pickle.dump(ml_models["als"], file)

    ml_models.clear()


app = FastAPI(lifespan=lifespan)

class Movie(BaseModel):
    movieId: int
    rating: float

class History(BaseModel):
    userId: int
    reviews: List[Movie] = []

@app.post("/popularMovies")
async def popular_movies(history: History):
    if len(history.reviews) < MIN_PREDICT_MOVIES:
        return HTTPException(status_code=412, detail="Provide more movie IDs")
    output = ml_models["popularMovies"].predict(history.reviews)
    print(type(output))
    return {
        "movie_ids": list(output)
    }

@app.post("/similarMovies")
async def user_recommendations(movie: Movie):
    output = ml_models["als"].predictSimilar(movie.movieId)
    return {
        "movie_ids": output.tolist()
    }

@app.post("/predictUser")
async def user_recommendations(history: History):
    if len(history.reviews) < MIN_PREDICT_MOVIES:
        return HTTPException(status_code=412, detail="Provide more movie IDs")
    data = make_coo_row(history.dict()["reviews"], ml_models["encoder"]).tocsr()
    output = ml_models["als"].predict(history.userId, data)
    return {
            "movie_ids": output.tolist()
    }


@app.post("/updateUser")
async def update_user(history: History,  status_code=200):
    data = make_coo_row(history.dict()["reviews"], ml_models["encoder"]).tocsr()
    ml_models["als"].update(history.userId, data)
    
