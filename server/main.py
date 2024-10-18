import sys
import os

# from detector import Detector

from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_ngrok import run_with_ngrok
import speech_recognition as sr

from transcribe import transcribe

# from householdObjDet import detectHouseHoldObj


app = Flask(__name__)
CORS(app)

# detector = Detector("./vehicle_yolo/vehicle_yolo5.pt")

# @app.route('/detect', methods=['POST'])
# def detect():
#     image = request.files['image']
#     image.save('temp.png')
#     detector.detect('temp.png')
#     return jsonify(detector.get_annotations())


@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    # print the file name
    print(file.filename)
    # store the file in the current directory
    file.save(file.filename)
    text = transcribe()
    return jsonify(text)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
