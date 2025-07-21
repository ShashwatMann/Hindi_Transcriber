### Hindi Voice Transcription Web App

This is a real-time Hindi voice transcription web application built with Flask and the faster-whisper model. It allows users to record audio in Hindi from their browser and transcribe it into text using a lightweight and efficient Whisper implementation.

<img width="1912" height="898" alt="image" src="https://github.com/user-attachments/assets/41021679-6935-488b-9a17-e6381edc6c5b" />
<img width="1918" height="900" alt="image" src="https://github.com/user-attachments/assets/3b1bd88f-d96e-4a1b-824a-0a64579f6b9d" />
<img width="1913" height="902" alt="image" src="https://github.com/user-attachments/assets/d991d472-0537-45f6-b93d-74eaa75d37ad" />
<img width="1918" height="892" alt="image" src="https://github.com/user-attachments/assets/6664c632-e8cd-480c-8319-f604b6ca0f0f" />



### 🚀 Features
- Real-time voice recording from browser
- Hindi language transcription using faster-whisper
- Interactive and responsive frontend (HTML/CSS/JS with TailwindCSS)
- GPU acceleration (if available)
- Dark mode support

### 🚀 Ideas for Future Features
- Add other languages as well
- Translate it into another language
- Provide summary of the transcription
- Add text chat features as well.

### 📁 Project Structure
```
.
├── app.py              # Flask backend to handle transcription
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html      # Frontend HTML template
├── static/
│   ├── styles.css      # Custom styles
│   └── script.js       # Frontend JS logic for recording & UI
```


### 🧠 Model

Uses faster-whisper for efficient and fast speech-to-text transcription in Hindi. The backend auto-detects GPU and uses float16 computation if available.

⚙️ Setup Instructions
1. Clone the Repository
```
git clone [<your-repo-url>](https://github.com/ShashwatMann/Hindi_Transcriber)
cd Hindi_Transcriber
```

2. Create a Virtual Environment
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Dependencies
```
pip install -r requirements.txt
```

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
