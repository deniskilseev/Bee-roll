from fastapi import FastAPI, Query
from pydantic import BaseModel
from contextlib import asynccontextmanager
from config import PATH_TO_MOVIE_MODEL
from typing import List
import joblib
from dummy_model import DummyModel


ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    with open(PATH_TO_MOVIE_MODEL, "rb") as file:
        ml_models["movies"] = joblib.load(file)
    # Add other models afterward
    yield
    # Clean up the ML models and release the resources
    ml_models.clear()


app = FastAPI(lifespan=lifespan)


@app.post("/movies")
async def predict(q: List[int] = Query(None)):
    movie_ids = q["movie_ids"]
    predict_movie(movie_ids)
    return {
        "movie_ids": list(output)
    }


