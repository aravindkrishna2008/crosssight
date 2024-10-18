import sys
import os

# from detector import Detector

from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_ngrok import run_with_ngrok
import speech_recognition as sr

from gpt import chat_completion

from transcribe import transcribe

# from householdObjDet import detectHouseHoldObj


app = Flask(__name__)
CORS(app)

# create a queue
transcribed_text = []

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
    transcribed_text.append(text)
    gptText = chat_completion(text)
    return jsonify(gptText)

@app.route('/send_image', methods=['POST'])
def send_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    print(file.filename)
    file.save("image.jpg")
    return jsonify("Image received")

@app.route('/gpt', methods=['POST'])
def gpt3():
    data = request.json
    message = data['message']
    response = chat_completion(message)
    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
