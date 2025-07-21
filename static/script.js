let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let currentChatId = null;

const recordButton = document.getElementById('recordButton');
const chatBox = document.getElementById('chat-box');
const canvas = document.getElementById('waveform');
const canvasCtx = canvas.getContext('2d');
const historyList = document.getElementById("historyList");

function newChat() {
  currentChatId = Date.now().toString();
  localStorage.setItem("currentChat", currentChatId);
  localStorage.setItem(currentChatId, JSON.stringify([]));
  chatBox.innerHTML = '<div class="text-center text-gray-500">🎙️ Click the mic to start speaking in Hindi</div>';
  renderHistory();
}

function saveToHistory(text) {
  if (!currentChatId) newChat();
  const timestamp = new Date().toLocaleString();
  const chat = JSON.parse(localStorage.getItem(currentChatId) || "[]");
  chat.push({ timestamp, text });
  localStorage.setItem(currentChatId, JSON.stringify(chat));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  Object.keys(localStorage).forEach(key => {
    if (key === "currentChat") return;
    const chat = JSON.parse(localStorage.getItem(key) || "[]");
    if (chat.length > 0) {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center hover:bg-gray-700 p-2 rounded";
      li.innerHTML = `
        <span class="truncate max-w-[120px] cursor-pointer" onclick="loadChat('${key}')">
          ${chat[0].text.slice(0, 30)}...
        </span>
        <button onclick="deleteChat('${key}')" class="text-red-400 hover:text-red-600 ml-2">🗑️</button>`;
      historyList.appendChild(li);
    }
  });
}

function deleteChat(id) {
  if (confirm("Are you sure you want to delete this chat?")) {
    localStorage.removeItem(id);
    if (localStorage.getItem("currentChat") === id) {
      localStorage.removeItem("currentChat");
      chatBox.innerHTML = '<div class="text-center text-gray-500">🎙️ Click the mic to start speaking in Hindi</div>';
    }
    renderHistory();
  }
}

function loadChat(id) {
  currentChatId = id;
  localStorage.setItem("currentChat", currentChatId);
  const chat = JSON.parse(localStorage.getItem(id) || "[]");
  chatBox.innerHTML = "";
  chat.forEach(entry => {
    appendMessage(entry.text, "ai");
  });
}

async function toggleRecording() {
  const micPrompt = document.getElementById('micPrompt');

  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.fftSize);
    source.connect(analyser);
    drawWaveform();
    canvas.classList.remove('hidden');

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      cancelAnimationFrame(animationId);
      canvas.classList.add('hidden');

      if (micPrompt) micPrompt.style.display = 'block';  // Show again when stopped

      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob);
      appendMessage('spinner', 'system');

      const response = await fetch('/transcribe', { method: 'POST', body: formData });
      const data = await response.json();
      document.querySelectorAll('.system-message').forEach(el => el.remove());

      if (data.transcript) {
        appendMessage(data.transcript, 'ai');
        saveToHistory(data.transcript);
      } else {
        appendMessage(`❌ ${data.error || 'Unknown error'}`, 'error');
      }

      audioChunks = [];
    };

    mediaRecorder.start();
    isRecording = true;
    recordButton.innerText = 'Stop Recording';
    appendMessage('🎤 Listening...', 'user');

    if (micPrompt) micPrompt.style.display = 'none';  // Hide while listening
  } else {
    mediaRecorder.stop();
    isRecording = false;
    recordButton.innerText = 'Start Listening';
    if (micPrompt) micPrompt.style.display = 'block';  // Show again when stopped
  }
}


function drawWaveform() {
  animationId = requestAnimationFrame(drawWaveform);
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx.fillStyle = '#1f2937';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = '#60a5fa';
  canvasCtx.beginPath();
  let sliceWidth = canvas.width * 1.0 / dataArray.length;
  let x = 0;
  for (let i = 0; i < dataArray.length; i++) {
    let v = dataArray[i] / 128.0;
    let y = v * canvas.height / 2;
    if (i === 0) canvasCtx.moveTo(x, y);
    else canvasCtx.lineTo(x, y);
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

function appendMessage(message, type) {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble', 'px-4', 'py-2', 'rounded-lg', 'max-w-[80%]', 'break-words');
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timestampEl = document.createElement('div');
  timestampEl.classList.add('text-xs', 'text-gray-400', 'mt-1');
  timestampEl.textContent = timestamp;

  switch(type) {
    case 'user':
      bubble.classList.add('bg-blue-600', 'text-white', 'self-end');
      bubble.textContent = message;
      break;
    case 'ai':
      bubble.classList.add('bg-gray-100', 'text-gray-900', 'self-start');
      bubble.textContent = message;
      break;
    case 'system':
      bubble.classList.add('bg-gray-100', 'text-gray-800', 'system-message', 'italic');
      if (message === 'spinner') {
        bubble.innerHTML = `<div class="flex items-center"><div class="spinner"></div><span>Transcribing...</span></div>`;
      } else {
        bubble.textContent = message;
      }
      break;
    case 'error':
      bubble.classList.add('bg-red-500', 'text-white', 'self-center');
      bubble.textContent = message;
      break;
  }

  bubble.appendChild(timestampEl);
  const container = document.createElement('div');
  container.classList.add('flex', type === 'user' ? 'justify-end' : 'justify-start');
  container.appendChild(bubble);
  chatBox.appendChild(container);
  chatBox.scrollTop = chatBox.scrollHeight;
}

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
  document.documentElement.classList.toggle('dark');
  document.body.classList.toggle('bg-gray-900');
  document.body.classList.toggle('bg-white');
  document.body.classList.toggle('text-white');
  document.body.classList.toggle('text-black');
  chatBox.classList.toggle('bg-gray-800');
  chatBox.classList.toggle('bg-gray-200');
});

if (localStorage.getItem("currentChat")) {
  loadChat(localStorage.getItem("currentChat"));
} else {
  newChat();
}