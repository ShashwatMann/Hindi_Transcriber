### Hindi Voice Transcription Web App

This is a real-time Hindi voice transcription web application built with Flask and the faster-whisper model. It allows users to record audio in Hindi from their browser and transcribe it into text using a lightweight and efficient Whisper implementation.

### 🚀 Features
- 🎤 Real-time voice recording from browser
- 📜 Hindi language transcription using faster-whisper
- 💻 Interactive and responsive frontend (HTML/CSS/JS with TailwindCSS)
- ⚙️ GPU acceleration (if available)
- 🌗 Dark mode support


### 📁 Project Structure
`
.
├── app.py              # Flask backend to handle transcription
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html      # Frontend HTML template
├── static/
│   ├── styles.css      # Custom styles
│   └── script.js       # Frontend JS logic for recording & UI
`


### 🧠 Model

Uses faster-whisper for efficient and fast speech-to-text transcription in Hindi. The backend auto-detects GPU and uses float16 computation if available.

⚙️ Setup Instructions
1. Clone the Repository
`git clone [<your-repo-url>](https://github.com/ShashwatMann/Hindi_Transcriber)`
`cd Hindi_Transcriber`

2. Create a Virtual Environment
`python -m venv venv`
`source venv/bin/activate  # On Windows: venv\Scripts\activate`

3. Install Dependencies
`pip install -r requirements.txt`

App will be accessible at http://localhost:5000.

🎯 Usage
- Open the app in a browser.
- Click Start Listening to begin recording.
- Speak in Hindi.
- The app will send your voice to the backend for transcription.
- Transcribed text appears on screen.

📝 Notes
- Only mono, 16kHz WAV audio is ideal for best results.
- Make sure your browser supports microphone access and HTTPS if deploying.

🧪 Tech Stack
- Backend: Python, Flask, Torch, faster-whisper
- Frontend: HTML, Tailwind CSS, JavaScript
- Deployment-ready: Run locally or host via a container/cloud platform

🧑‍💻 Author
Built by Shashwat Mann — drop a star if this helped!
