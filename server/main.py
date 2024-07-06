import sys
import os

from detector import Detector

from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_ngrok import run_with_ngrok


app = Flask(__name__)
run_with_ngrok(app)
CORS(app)

detector = Detector("./vehicle_yolo/vehicle_yolo5.pt")

@app.route('/detect', methods=['POST'])
def detect():
    image = request.files['image']
    image.save('temp.png')
    detector.detect('temp.png')
    return jsonify(detector.get_annotations())


if __name__ == "__main__":
    app.run()

