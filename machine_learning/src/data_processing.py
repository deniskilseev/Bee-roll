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

def process_input(path_to_films, path_to_reviews, output_dir, n_parts=10):
    films = pd.read_csv(path_to_films)
    reviews = pd.read_csv(path_to_reviews)
    movie_reviews = reviews.merge(films, on="movieId").sort_values(by="timestamp")
    movie_reviews["timestamp"] = movie_reviews["timestamp"].apply(datetime.fromtimestamp)
    movie_reviews["genres"] = movie_reviews["genres"].apply(parse_genres)
    users_history = []
    n_users = movie_reviews["userId"].nunique()
    part = 0
    for user_id in tqdm(movie_reviews["userId"].unique()):
        user_reviews = movie_reviews[movie_reviews["userId"] == user_id]
        history = UserHistory(user_id)
        for rid, row in user_reviews.iterrows():
            movie = Movie(row.movieId, row.title, row.genres)
            review = Review(movie, row.timestamp, row.rating)
            history.add_review(review)
        users_history.append(history)
        if len(users_history) >= n_users / n_parts:
            with open(os.path.join(output_dir, f"processed_{part}.data"), "ab") as file:
                pickle.dump(users_history, file)
            print (f"Processed {part + 1}/{n_parts} of data")
            users_history = []
            part += 1
    if n_parts > part:
        with open(os.path.join(output_dir, f"processed_{part}.data"), "ab") as file:
            pickle.dump(users_history, file)
        print (f"Processed {part + 1}/{n_parts} of data")
        users_history = []
        part += 1



def parse_genres(genres_list):
    if genres_list == "(no genres listed)":
        return []
    return genres_list.split("|")
    

if __name__ == "__main__":
    random.seed(42) # Ah, yes, the number
    process_input(cfg.MOVIES_CSV_PATH, cfg.REVIEWS_CSV_PATH, "../tmp/")

