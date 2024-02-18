from datetime import datetime
import numpy as np
import pandas as pd
import pickle
import os
import random
from tqdm import tqdm

import config as cfg


class Movie:
    def __init__(self, movie_id, title, genres):
        self.data = {
            "mid": movie_id,
            "title": title,
            "genres": genres
        }


class Review:
    def __init__(self, movie, review_datetime, review_rating, **kwargs):
        self.data = {
            **{"movie": movie, "datetime": review_datetime, "rating": review_rating},
            **kwargs,
        }
    
    def as_dict(self):
        return self.data

    def movie(self):
        return self.data["movie"]


class UserHistory():
    def __init__(self, user_id):
        self.data = {
            "user_id": user_id,
            "review_history": []
        }

    def add_review(self, review):
        self.data["review_history"].append(review)

    def as_dict(self):
        return self.data

    def user_id(self):
        return self.data["user_id"]

def process_input(path_to_films, path_to_reviews, output_dir):
    films = pd.read_csv(path_to_films)
    reviews = pd.read_csv(path_to_reviews)
    movie_rewiews = reviews.merge(films, on="movieId").sort_values(by="timestamp")
    movie_reviews = movie_rewiews["timestamp"].apply(datetime.fromtimestamp)
    movie_reviews = movie_rewiews["genres"].apply(parse_genres)
    users_history = []
    for user_id in tqdm(movie_reviews["userId"].unique()):
        user_reviews = movie_rewiews[movie_rewiews["userId"] == user_id]
        history = UserHistory(user_id)
        for uid, movieid, rating, time, title, genre_list in user_reviews.iterrows():
            movie = Movie(movie_id, title, genre_list)
            review = Review(movie, time, rating)
            history.add_review(review)
        users_history.append(history)
    pickle.dump(users_history, os.path.join(output_dir, "processed.data"))





def parse_genres(genres_list):
    if genres_list == "(no genres listed)":
        return []
    return genres_list.split("|")
    

if __name__ == "__main__":
    random.seed(42) # Ah, yes, the number
    process_input(cfg.MOVIES_CSV_PATH, cfg.REVIEWS_CSV_PATH, "../tmp/")

