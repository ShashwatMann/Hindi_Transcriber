import os
import io
import torch
import wave
from flask import Flask, request, jsonify, render_template
from faster_whisper import WhisperModel



app = Flask(__name__)

# Device Setup
use_gpu = torch.cuda.is_available()
model_size = "medium"

if use_gpu:
    print("✅ GPU detected. Using CUDA with float16.")
    model = WhisperModel(model_size, device="cuda", compute_type="float16")
else:
    print("⚠️ GPU not found. Using CPU with float32.")
    model = WhisperModel(model_size, device="cpu", compute_type="float32", cpu_threads=6, num_workers=2)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/transcribe", methods=["POST"])  
def transcribe():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided."}), 400

    audio_file = request.files['audio']
    audio_data = audio_file.read()

    try:
        buffer = io.BytesIO(audio_data)
        '''with wave.open(buffer, 'rb') as wf:
            if wf.getnchannels() != 1 or wf.getframerate() != 16000:
                return jsonify({"error": "Audio must be mono and 16kHz."}), 400'''

        segments, _ = model.transcribe(
            buffer,
            language="hi",
            beam_size=5,
            vad_filter=True,
            vad_parameters={"threshold": 0.5},
            temperature=0.0,
            no_speech_threshold=0.5
        )

        transcript = " ".join([segment.text for segment in segments])
        return jsonify({"transcript": transcript.strip()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
