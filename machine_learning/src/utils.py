import config as cfg

import hashlib
import pandas as pd
import numpy as np
from scipy import sparse as sp

class MovieEncoder():
    def __init__(self, movie_csv_path):
        self.movie_idx = dict() # Translate movieId to index
        self.movie_mid = dict() # Translate index to movieId
        for idx, mid in enumerate(pd.read_csv(movie_csv_path).movieId.values):
            self.movie_idx[mid] = idx
            self.movie_mid[idx] = mid

    def to_mid(self, x):
        if type(x) == int:
            idx = x
            return self.movie_mid[idx]
        return [self.movie_mid[idx] for idx in x]

    def to_idx(self, x):
        if type(x) == int:
            mid = x
            return self.movie_idx[mid]
        return [self.movie_idx[mid] for mid in x]

    @property
    def num_items(self):
        return len(self.movie_idx)


class GenreEncoder():
    def __init__(self, movie_csv_path):
        self.genre_idx = {} # Translate a genre into index
        self.genre_name = {} # Translate an index into genre
        self.movie_genres = {} # Get genres of a movie
        n_genres = 0
        for idx, row in enumerate(pd.read_csv(movie_csv_path).itertuples()):
            genre_names = self._process_genre_list(row.genres)
            self.movie_genres[row.movieId] = []
            for genre in genre_names:
                if genre not in genre_idx.keys():
                    self.genre_idx[genre] = n_genres
                    self.genre_names[n_genres] = genre
                    n_genres += 1
                self.movie_genres[row.movieId].append(self.genre_idx[genre])

    def _process_genre_list(self, genres):
        if genres == "(no genres listed)":
            return []
        else:
            return genres.split("|")

    def to_name(self, x):
        if type(x) == int:
            idx = x
            return self.genre_name[idx]
        return [self.genre_name[idx] for idx in x]

    def to_idx(self, x):
        if type(x) == str:
            name = x
            return self.genre_idx[name]
        return [self.genre_idx[name] for name in x]

    def list_movie_genres(self, x):
        if type(x) == str:
            name = x
            return self.movie_genres(name)
        return [self.movie_genres[name] for name in x]


def make_coo_row(review_history, movie_encoder: MovieEncoder):
    idx = []
    values = []

    for review in review_history:
        idx.append(movie_encoder.to_idx(review["movieId"]))
        values.append(review["rating"])

    return sp.coo_matrix(
        (np.array(values).astype(np.float64), ([0] * len(idx), idx)), shape=(1, movie_encoder.num_items),
    )


def get_part_path(n_part, part_dir=cfg.TEMPORATY_FILES_PATH):
    return "{}/{:02d}.json.splitted".format(part_dir, n_part)


def user_hash(x):
    return int(hashlib.md5(x.encode()).hexdigest(), 16)

