from vehicle_yolo import VehicleDetector

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

detector = VehicleDetector()

@app.route('/detect', methods=['POST'])
def detect():
    image = request.files['image']
    result = detector.detect(image)
    return jsonify(result)
