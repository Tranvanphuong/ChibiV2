// Review list
let reviewList = [];
let currentCardIndex = 0;
let currentVocabForReview = null; // To store the vocabulary item currently displayed in tu_vung.html

// DOM elements (will be initialized by initFlashcardReview)
let flashcard, flipCardBtn, nextCardBtn, reviewListContainer, addToReviewBtn;
let fcKanji, fcHiragana, fcRomaji, fcMeaning, fcAudioIcon, mainVocabAudioIcon; // Added fcAudioIcon and mainVocabAudioIcon

// Functions to be called from tu_vung.html
export function initFlashcardReview() {
    // Get DOM elements
    flashcard = document.getElementById('flashcard');
    flipCardBtn = document.getElementById('flipCard');
    nextCardBtn = document.getElementById('nextCard');
    reviewListContainer = document.getElementById('reviewList');
    addToReviewBtn = document.getElementById('addToReview');
    fcKanji = document.getElementById('fc-kanji');
    fcHiragana = document.getElementById('fc-hiragana');
    fcRomaji = document.getElementById('fc-romaji');
    fcMeaning = document.getElementById('fc-meaning');
    fcAudioIcon = document.getElementById('fc-audio-icon'); // Initialize fcAudioIcon
    mainVocabAudioIcon = document.getElementById('main-vocab-audio-icon'); // Initialize mainVocabAudioIcon

    // Event listeners
    if (addToReviewBtn) {
        addToReviewBtn.addEventListener('click', () => {
            if (currentVocabForReview) {
                if (!reviewList.some(word => word.id === currentVocabForReview.id)) {
                    reviewList.push(currentVocabForReview);
                    updateReviewList();
                    showNotification('Đã thêm vào danh sách ôn tập!');
                } else {
                    showNotification('Từ này đã có trong danh sách ôn tập!', 'error');
                }
            } else {
                showNotification('Không có từ vựng để thêm vào danh sách ôn tập!', 'error');
            }
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

    // Event listener for audio icon (flashcard)
    if (fcAudioIcon) {
        fcAudioIcon.addEventListener('click', function() {
            const audioUrl = this.getAttribute('data-audio-url');
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                showNotification('Không có URL âm thanh.', 'error');
            }
        });
    }

    // Event listener for main vocabulary audio icon
    if (mainVocabAudioIcon) {
        mainVocabAudioIcon.addEventListener('click', function() {
            const audioUrl = this.getAttribute('data-audio-url');
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                showNotification('Không có URL âm thanh.', 'error');
            }
        });
    }

    updateReviewList(); // Initialize review list display
}

export function setCurrentVocab(vocab) {
    currentVocabForReview = vocab;

    // Update main vocabulary audio icon
    if (mainVocabAudioIcon) {
        
        mainVocabAudioIcon.setAttribute('data-audio-url', vocab.audio_url);
        mainVocabAudioIcon.classList.remove('hidden');
    
    }
}

// Internal functions
function displayCurrentCard() {
    if (reviewList.length > 0) {
        const currentCard = reviewList[currentCardIndex];
        if (fcKanji) fcKanji.textContent = currentCard.kanji_main;
        if (fcHiragana) fcHiragana.textContent = currentCard.hiragana;
        if (fcRomaji) fcRomaji.textContent = currentCard.romaji;
        if (fcMeaning) fcMeaning.textContent = currentCard.nghia;

        // Handle audio icon visibility and data
        if (fcAudioIcon) {
            if (currentCard.audio_url) {
                fcAudioIcon.setAttribute('data-audio-url', currentCard.audio_url);
                fcAudioIcon.classList.remove('hidden');
            } else {
                fcAudioIcon.classList.add('hidden');
                fcAudioIcon.removeAttribute('data-audio-url');
            }
        }
    } else {
        if (fcKanji) fcKanji.textContent = "Không có từ";
        if (fcHiragana) fcHiragana.textContent = "Không có từ";
        if (fcRomaji) fcRomaji.textContent = "Không có từ";
        if (fcMeaning) fcMeaning.textContent = "Danh sách ôn tập trống";
        if (fcAudioIcon) { // Hide audio icon if no vocabulary
            fcAudioIcon.classList.add('hidden');
            fcAudioIcon.removeAttribute('data-audio-url');
        }
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
                    <div class="font-bold text-orange-700">${word.kanji_main}</div>
                    <div class="text-sm text-gray-600">${word.nghia}</div>
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
            } else {
                displayCurrentCard(); // Update to show empty state
            }
        });
    });
    displayCurrentCard(); // Update flashcard display after list changes
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
