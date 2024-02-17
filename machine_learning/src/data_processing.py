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


def UserHistory():
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



