import pandas as pd
import numpy as np
from scipy import sparse as sp

class PopularMovies():
    def __init__(self, dataframe):
        self.sortedMovies = dataframe

    def predict(self, x, nPredictions=50):
        # Predict a for ratings
        X = [item.movieId for item in x] 
        movieIds = self.sortedMovies["movie_id"][:len(x) + nPredictions]
        answer = [movieId for movieId in movieIds if movieId not in X]
        answer = pd.Series(answer[:nPredictions])
        return answer

class ALS():
    def __init__(self, model):
        self.model = model
    
    def update(self, user_id, row):
        self.model.partial_fit_users(np.array([user_id]), row)

    def predict(self, user_id, row, nPredictions=50):
        return self.model.recommend(userid=user_id, N=nPredictions, user_items=row, filter_already_liked_items=True, recalculate_user=True)[0]

    def predictSimilarMovies(self, movie_id, nPredictions=1):
        return self.model.similar_items(movie_id, N=nPredictions,filter_items=movie_id)[0]

    def predictSimilarUsers(self, user_id, nPredictions=1):
        return self.model.similar_users(user_id, N=nPredictions, filter_users=user_id)[0]
