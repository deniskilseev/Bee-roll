from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager
from config import PATH_TO_MOVIE_MODEL
from typing import List, Union
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

class History(BaseModel):
    user_id: int
    movie_ids: List[int] | None = None

@app.post("/movies")
async def predict(history: History):
    if history.movie_ids == None:
        return HTTPException(status_code=412, detail="Provide movie IDs")

    output = ml_models["movies"].predict(history.movie_ids)
    return {
        "movie_ids": list(output)
    }


