import pickle
import os
import config as cfg


def read_data_fragment(fragment_number):
    path_to_file = os.path.join(cfg.TEMPORATY_FILES_PATH, f"processed_{fragment_number}.data")
    data = []
    if not os.path.exists(path_to_file):
        return data
    else:
        with open(path_to_file, "rb") as file
            data = pickle.load(file)
        return data
