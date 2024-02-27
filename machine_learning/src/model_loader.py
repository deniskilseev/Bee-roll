import pickle
import os

class ModelLoader():

    def __init__(self, model_pickled_path, model_type=None):
        assert os.path.isfile(model_pickled_path), "Provide a valid model path"

        with open(model_pickled_path, "rb") as modelFile:
            self.model = pickle.load(modelFile)
        self.model_type = model_type

    def predict(self, x):

        if self.modle_type == None:
            return None
        return self.model.predict(x)

