// Sample vocabulary data
const vocabulary = [
    {
        kanji: "日本語",
        hiragana: "にほんご",
        romaji: "Chibi",
        meaning: "Tiếng Nhật",
        audio: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=%E6%97%A5%E6%9C%AC%E8%AA%9E&kana=%E3%81%AB%E3%81%BB%E3%82%93%E3%81%94"
    },
    {
        kanji: "学生",
        hiragana: "がくせい",
        romaji: "Gakusei",
        meaning: "Học sinh",
        audio: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=%E5%AD%A6%E7%94%9F&kana=%E3%81%8C%E3%81%8F%E3%81%9B%E3%81%84"
    },
    {
        kanji: "本",
        hiragana: "ほん",
        romaji: "Hon",
        meaning: "Sách",
        audio: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=%E6%9C%AC&kana=%E3%81%BB%E3%82%93"
    },
    {
        kanji: "水",
        hiragana: "みず",
        romaji: "Mizu",
        meaning: "Nước",
        audio: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=%E6%B0%B4&kana=%E3%81%BF%E3%81%9A"
    },
    {
        kanji: "食べ物",
        hiragana: "たべもの",
        romaji: "Tabemono",
        meaning: "Thức ăn",
        audio: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=%E9%A3%9F%E3%81%B9%E7%89%A9&kana=%E3%81%9F%E3%81%B9%E3%82%82%E3%81%AE"
    }
];

// Review list
let reviewList = [];
let currentWordIndex = 0;
let currentCardIndex = 0;

// DOM elements
let kanjiDisplay, hiraganaDisplay, romajiDisplay, meaningDisplay;
let playAudioBtn, wordAudio, addToReviewBtn, nextWordBtn;
let flashcard, flipCardBtn, nextCardBtn, reviewListContainer;
let fcKanji, fcHiragana, fcRomaji, fcMeaning;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    kanjiDisplay = document.querySelector('.kanji-display');
    hiraganaDisplay = document.querySelector('.hiragana-display');
    romajiDisplay = document.querySelector('.romaji-display');
    meaningDisplay = document.querySelector('.meaning-display');
    playAudioBtn = document.getElementById('playAudio');
    wordAudio = document.getElementById('wordAudio');
    addToReviewBtn = document.getElementById('addToReview');
    nextWordBtn = document.getElementById('nextWord');
    flashcard = document.getElementById('flashcard');
    flipCardBtn = document.getElementById('flipCard');
    nextCardBtn = document.getElementById('nextCard');
    reviewListContainer = document.getElementById('reviewList');
    fcKanji = document.getElementById('fc-kanji');
    fcHiragana = document.getElementById('fc-hiragana');
    fcRomaji = document.getElementById('fc-romaji');
    fcMeaning = document.getElementById('fc-meaning');
    
    // Initialize with first word
    displayCurrentWord();
    
    // Event listeners
    if (playAudioBtn) {
        playAudioBtn.addEventListener('click', () => {
            if (wordAudio) wordAudio.play();
        });
    }
    
    if (addToReviewBtn) {
        addToReviewBtn.addEventListener('click', () => {
            const currentWord = vocabulary[currentWordIndex];
            if (!reviewList.some(word => word.kanji === currentWord.kanji)) {
                reviewList.push(currentWord);
                updateReviewList();
                showNotification('Đã thêm vào danh sách ôn tập!');
            } else {
                showNotification('Từ này đã có trong danh sách ôn tập!', 'error');
            }
        });
    }
    
    if (nextWordBtn) {
        nextWordBtn.addEventListener('click', () => {
            currentWordIndex = (currentWordIndex + 1) % vocabulary.length;
            displayCurrentWord();
        });
    }
    
    if (flipCardBtn) {
        flipCardBtn.addEventListener('click', () => {
            if (flashcard) flashcard.classList.toggle('flipped');
        });
    }
    
    if (nextCardBtn) {
        nextCardBtn.addEventListener('click', () => {
            if (reviewList.length > 0) {
                currentCardIndex = (currentCardIndex + 1) % reviewList.length;
                displayCurrentCard();
                if (flashcard && flashcard.classList.contains('flipped')) {
                    flashcard.classList.remove('flipped');
                }
            } else {
                showNotification('Danh sách ôn tập trống!', 'error');
            }
        });
    }
});

// Functions
function displayCurrentWord() {
    const currentWord = vocabulary[currentWordIndex];
    if (kanjiDisplay) kanjiDisplay.textContent = currentWord.kanji;
    if (hiraganaDisplay) hiraganaDisplay.textContent = currentWord.hiragana;
    if (romajiDisplay) romajiDisplay.textContent = currentWord.romaji;
    if (meaningDisplay) meaningDisplay.textContent = currentWord.meaning;
    if (wordAudio) wordAudio.src = currentWord.audio;
}

function displayCurrentCard() {
    if (reviewList.length > 0) {
        const currentCard = reviewList[currentCardIndex];
        if (fcKanji) fcKanji.textContent = currentCard.kanji;
        if (fcHiragana) fcHiragana.textContent = currentCard.hiragana;
        if (fcRomaji) fcRomaji.textContent = currentCard.romaji;
        if (fcMeaning) fcMeaning.textContent = currentCard.meaning;
    }
}

function updateReviewList() {
    if (!reviewListContainer) return;
    
    if (reviewList.length === 0) {
        reviewListContainer.innerHTML = '<div class="text-center text-gray-500 py-4">Danh sách ôn tập trống</div>';
        return;
    }
    
    let html = '';
    reviewList.forEach((word, index) => {
        html += `
            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                    <div class="font-bold text-orange-700">${word.kanji}</div>
                    <div class="text-sm text-gray-600">${word.meaning}</div>
                </div>
                <button class="remove-review text-red-500 hover:text-red-700" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    reviewListContainer.innerHTML = html;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-review').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            reviewList.splice(index, 1);
            updateReviewList();
            
            // Adjust current card index if needed
            if (currentCardIndex >= reviewList.length) {
                currentCardIndex = Math.max(0, reviewList.length - 1);
            }
            
            if (reviewList.length > 0) {
                displayCurrentCard();
            }
        });
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}
