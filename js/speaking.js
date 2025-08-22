// Sample sentences
const sentences = [
    "はじめまして。どうぞよろしくおねがいします。",
    "お元気ですか？",
    "これは何ですか？",
    "お名前は何ですか？",
    "どこから来ましたか？"
];

let currentSentenceIndex = 0;
let mediaRecorder;
let audioChunks = [];
let audioBlob;

// DOM elements
const sentenceToSpeak = document.getElementById('sentence-to-speak');
const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-btn');
const playBtn = document.getElementById('play-btn');
const resultDiv = document.getElementById('result');
const nextSentenceBtn = document.getElementById('next-sentence-btn');

// Initialize
function init() {
    sentenceToSpeak.textContent = sentences[currentSentenceIndex];
    
    recordBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    playBtn.addEventListener('click', playRecording);
    nextSentenceBtn.addEventListener('click', nextSentence);
}

// Start recording
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            // For demo, we'll just log the blob. In a real app, you'd send this to a speech-to-text API.
            console.log('Audio recorded:', audioBlob);
            resultDiv.textContent = 'Đang phân tích giọng nói... (Chức năng nhận diện giọng nói cần API)';
            
            // Simulate API response
            setTimeout(() => {
                resultDiv.textContent = `Bạn đã nói: "${sentences[currentSentenceIndex]}" (Giả lập)`;
            }, 2000);
        };

        mediaRecorder.start();
        recordBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        resultDiv.textContent = 'Đang ghi âm...';
    } catch (err) {
        console.error('Error accessing microphone:', err);
        resultDiv.textContent = 'Lỗi: Không thể truy cập microphone.';
    }
}

// Stop recording
function stopRecording() {
    mediaRecorder.stop();
    recordBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
}

// Play recording
function playRecording() {
    if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    } else {
        resultDiv.textContent = 'Chưa có bản ghi âm nào.';
    }
}

// Next sentence
function nextSentence() {
    currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;
    sentenceToSpeak.textContent = sentences[currentSentenceIndex];
    resultDiv.textContent = '';
    audioBlob = null; // Clear previous recording
}

// Initialize the app
init();
