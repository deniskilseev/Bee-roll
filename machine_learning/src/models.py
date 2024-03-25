import pandas as pd

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
        self.model.recalculate_user(user_id, row)

    def predict(self, userId, row):
        return self.model.recommend(userid=userId, user_items=row, filter_already_liked_items=True, recalculate_user=True)[0]

    def predictSimilar(self, x, nPredictions=50):
        return self.model.similar_items(x, N=nPredictions,filter_items=x)[0]
