import pandas as pd

class PopularMovies():
    def __init__(self, dataframe):
        self.sortedMovies = dataframe

    def predict(self, x, nPredictions=50):
        # Predict a for ratings
        X = [item.movie_id for item in x] 
        movieIds = self.sortedMovies["movie_id"][:len(x) + nPredictions]
        answer = [movieId for movieId in movieIds if movieId not in X]
        answer = pd.Series(answer[:nPredictions])
        return answer

class SimilarMovies():
    def __init__(self, model):
        self.model = model

    def predict(self, x, nPredictions=50):
        return self.model.similar_items(x, N=nPredictions,filter_items=x)[0]
