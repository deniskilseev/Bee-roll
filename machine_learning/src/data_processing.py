import json
import os
import random
import pandas as pd
import config as cfg
from tqdm import tqdm
from utils import user_hash

class Review:
    def __init__(self, movie_id, review_timestamp, review_rating, **kwargs):
        self.data = {
            **{"movie_id": movie_id, "timestamp": review_timestamp, "rating": review_rating},
            **kwargs,
        }
    
    def as_dict(self):
        return self.data

    def movie_id(self):
        return self.data["movie_id"]


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

class RowProcessor:
    def __init__(self, output_path, n_parts=10):
        self.n_parts = n_parts
        os.makedirs(
            output_path, exist_ok=True,
        )

        self.files = []
        for i in range(self.n_parts):
            self.files.append(
                open(os.path.join(output_path, "{:02d}.json.splitted".format(i)), "w")
            )
        self._user = None
    
    def finish(self):
        self.flush()
        for file in self.files:
            file.close()

    def flush(self):
        if self._user != None:
            # All reviews of 1 user go into 1 part
            part_index = user_hash(self._user.user_id()) % n_parts
            # Writing gathered data about the user
            self.files[part_index].write(json.dumps(self._client.as_dict()) + "\n")

            self._user = None

    def consume_row(self, row):
        if self._user != None and self._user.user_id() != row.userId:
            self.flush()
        
        if self._user == None:
            self._user = UserHistory(row.userId)
        
        review = Review(row.movieId, row.timestamp, row.rating)

        self._user.add_review(review)


def process_input(input_path, output_path, n_parts=10):
    processor = RowProcessor(input_path, output_path, n_parts=n_parts)

    for files in tqdm(pd.read_csv(input_path, chunksize=250000)):
        for row in files.itertuples():
            processor.consume_row(row)

    processor.finish()
    

if __name__ == "__main__":
    random.seed(42) # Ah, yes, the number
    process_input(cfg.MOVIES_CSV_PATH, cfg.REVIEWS_CSV_PATH, "../tmp/")

