import numpy as np
import pandas as pd

from utils import MovieEncoder

class MostPopularMovies:
    def __init__(self, movie_csv_path, model_pickled_path):
        self.movie_encoder = MovieEncoder(movie_csv_path)
        self.model = pickle.load(open(model_pickled_path, "rb"))
    
    def predict(self, watch_history):
        predictions = model.predict(watch_history, self.movie_encoder)
        return self.movie_encoder.toMid(predictions)
        

