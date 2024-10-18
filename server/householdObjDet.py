from roboflow import Roboflow
import supervision as sv
import cv2

import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("ROBOFLOW_API_KEY")

rf = Roboflow(api_key=api_key)
project = rf.workspace().project("fridgedetection")
model = project.version(3).model



def detectHouseHoldObj(source):
    result = model.predict(source, confidence=40, overlap=30).json()
    labels = [item["class"] for item in result["predictions"]]
    detections = sv.Detections.from_roboflow(result)
    return detections


detectHouseHoldObj("./food.jpg")