import json
import random
import os
from tqdm import tqdm

import config as cfg


def review_to_target(review):
    return {
        "movieId": review["movieId"],
        "timestamp": review["timestamp"],
        "rating": review["rating"],
    }


if __name__ == "__main__":
    random.seed(42) # Funny Number

    print("process parts")

    json_dir = cfg.TEMPORATY_FILES_PATH
    ratio = cfg.TRAIN_RATIO

    for filename in tqdm(sorted(os.listdir(json_dir))):
        if not filename.endswith(".json"):
            continue
        js_path = os.path.join(json_dir, filename)
        splitted_file = open(js_path + ".splitted", "w")
        for js in (json.loads(s) for s in open(js_path)):
            sorted_reviews = sorted(js["review_history"], key= lambda x: x["timestamp"])
            split_candidates = [
                r["timestamp"] for r in sorted_reviews[int(len(sorted_reviews) * ratio):]
            ]

            if len(split_candidates) == 0: # Too small of a review history thus skipping it
                continue
            
            split_point = random.choice(split_candidates)

            train_reviews = [r for r in sorted_reviews if r["timestamp"] < split_point]
            validate_reviews = [r for r in sorted_reviews if r["timestamp"] >= split_point]

            sample = {}
            sample["user_id"] = js["user_id"]

            sample["review_history"] = train_reviews
            sample["target"] = [review_to_target(r) for r in validate_reviews]

            splitted_file.write(json.dumps(sample) + "\n")
        
        splitted_file.close()

