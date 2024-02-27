import pandas as pd

class DummyModel():
    def __init__(self, dataframe):
        self.sortedMovies = dataframe

    def predict(self, x, nPredictions=50):
        # Predict a for ratings
        movieIds = self.sortedMovies["movie_id"][:len(x) + nPredictions]
        answer = [movieId for movieId in movieIds if movieId not in x]
        answer = pd.Series(answer[:nPredictions])
        return answer
