// Questions data
const questions = [
    {
        question: "「こんにちは」はどういう意味ですか？",
        options: ["Good morning", "Good afternoon", "Good evening", "Good night"],
        answer: 1,
        explanation: "「こんにちは」means \"Good afternoon\" in Japanese."
    },
    {
        question: "「ありがとう」の正しい英語訳はどれですか？",
        options: ["Please", "Thank you", "Sorry", "Excuse me"],
        answer: 1,
        explanation: "「ありがとう」means \"Thank you\" in Japanese."
    },
    {
        question: "「水」の読み方は？",
        options: ["みず (mizu)", "ひ (hi)", "かぜ (kaze)", "つき (tsuki)"],
        answer: 0,
        explanation: "「水」is read as \"mizu\" and means \"water\"."
    },
    {
        question: "「私は学生です」の意味は？",
        options: ["I am a teacher", "I am a student", "I am a doctor", "I am a worker"],
        answer: 1,
        explanation: "「学生」means \"student\", so the sentence means \"I am a student\"."
    },
    {
        question: "「いぬ」は英語で何と言いますか？",
        options: ["Cat", "Dog", "Bird", "Fish"],
        answer: 1,
        explanation: "「いぬ」means \"dog\" in Japanese."
    },
    {
        question: "「すみません」はどのような時に使いますか？",
        options: ["謝るとき", "お礼を言うとき", "自己紹介するとき", "質問するとき"],
        answer: 0,
        explanation: "「すみません」is used when apologizing (meaning \"I'm sorry\") or getting someone's attention (\"Excuse me\")."
    },
    {
        question: "「1, 2, 3」を日本語でどう読みますか？",
        options: ["いち、に、さん", "ひと、ふた、み", "いっ、に、さん", "いち、じ、さん"],
        answer: 0,
        explanation: "The numbers 1, 2, 3 are read as \"いち、に、さん\" in Japanese."
    },
    {
        question: "「これは何ですか？」の意味は？",
        options: ["Where is this?", "What is this?", "Who is this?", "When is this?"],
        answer: 1,
        explanation: "「これは何ですか？」means \"What is this?\" in English."
    },
    {
        question: "「お元気ですか？」に対する適切な返答は？",
        options: ["ありがとう", "はい、元気です", "すみません", "お願いします"],
        answer: 1,
        explanation: "「はい、元気です」means \"Yes, I'm fine\" which is an appropriate response to \"How are you?\""
    },
    {
        question: "「さようなら」はいつ使いますか？",
        options: ["会ったとき", "別れるとき", "食事の前", "寝る前"],
        answer: 1,
        explanation: "「さようなら」is used when saying goodbye to someone."
    }
];

// DOM elements
let questionText, optionsContainer, submitBtn, feedbackModal, feedbackIcon, feedbackTitle, feedbackText, nextBtn;
let currentQuestionEl, totalQuestionsEl, progressBar, scoreContainer, scoreEl, maxScoreEl, scoreMessage, restartBtn, questionContainer;

// Quiz state
let currentQuestionIndex = 0;
let selectedOption = null;
let score = 0;
let quizCompleted = false;

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    questionText = document.getElementById('question-text');
    optionsContainer = document.getElementById('options-container');
    submitBtn = document.getElementById('submit-btn');
    feedbackModal = document.getElementById('feedback-modal');
    feedbackIcon = document.getElementById('feedback-icon');
    feedbackTitle = document.getElementById('feedback-title');
    feedbackText = document.getElementById('feedback-text');
    nextBtn = document.getElementById('next-btn');
    currentQuestionEl = document.getElementById('current-question');
    totalQuestionsEl = document.getElementById('total-questions');
    progressBar = document.getElementById('progress-bar');
    scoreContainer = document.getElementById('score-container');
    scoreEl = document.getElementById('score');
    maxScoreEl = document.getElementById('max-score');
    scoreMessage = document.getElementById('score-message');
    restartBtn = document.getElementById('restart-btn');
    questionContainer = document.getElementById('question-container');

    // Initialize quiz
    initQuiz();

    // Event listeners
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (selectedOption === null) return;
            
            const currentQuestion = questions[currentQuestionIndex];
            const isCorrect = selectedOption === currentQuestion.answer;
            
            // Disable submit button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
            
            // Disable all options
            document.querySelectorAll('#options-container button').forEach(opt => {
                opt.classList.add('cursor-not-allowed');
                opt.classList.remove('hover:bg-orange-50');
                
                // Mark correct answer
                if (parseInt(opt.dataset.index) === currentQuestion.answer) {
                    opt.classList.add('border-green-500', 'bg-green-50');
                }
                
                // Mark wrong answer if selected
                if (parseInt(opt.dataset.index) === selectedOption && !isCorrect) {
                    opt.classList.add('border-red-500', 'bg-red-50');
                }
            });
            
            // Update score if correct
            if (isCorrect) {
                score++;
            }
            
            // Show feedback
            showFeedback(isCorrect, currentQuestion.explanation);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (feedbackModal) feedbackModal.classList.add('hidden');
            currentQuestionIndex++;
            
            if (currentQuestionIndex < questions.length) {
                loadQuestion(currentQuestionIndex);
            } else {
                endQuiz();
            }
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            quizCompleted = false;
            
            if (scoreContainer) scoreContainer.classList.add('hidden');
            if (questionContainer) questionContainer.classList.remove('hidden');
            
            loadQuestion(currentQuestionIndex);
        });
    }
});

// Initialize quiz
function initQuiz() {
    if (totalQuestionsEl) totalQuestionsEl.textContent = questions.length;
    loadQuestion(currentQuestionIndex);
}

// Load question
function loadQuestion(index) {
    if (index >= questions.length) {
        endQuiz();
        return;
    }

    const question = questions[index];
    if (questionText) questionText.textContent = question.question;
    if (optionsContainer) optionsContainer.innerHTML = '';
    
    // Update progress
    if (currentQuestionEl) currentQuestionEl.textContent = index + 1;
    if (progressBar) {
        const progressPercentage = ((index + 1) / questions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    // Create options
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'option bg-white border border-orange-200 rounded-lg p-4 text-left transition cursor-pointer hover:bg-orange-50';
        optionElement.innerHTML = `
            <div class="flex items-center">
                <div class="w-6 h-6 rounded-full border-2 border-orange-300 flex items-center justify-center mr-3 flex-shrink-0">
                    <div class="w-3 h-3 rounded-full bg-orange-500 hidden"></div>
                </div>
                <span>${option}</span>
            </div>
        `;
        
        optionElement.dataset.index = i;
        optionElement.addEventListener('click', () => selectOption(optionElement, i));
        if (optionsContainer) optionsContainer.appendChild(optionElement);
    });
    
    // Reset selected option
    selectedOption = null;
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// Select option
function selectOption(optionElement, index) {
    // Remove selection from all options
    document.querySelectorAll('#options-container button').forEach(opt => {
        opt.classList.remove('border-orange-500', 'bg-orange-50');
        const innerCircle = opt.querySelector('.bg-orange-500');
        if (innerCircle) innerCircle.classList.add('hidden');
    });
    
    // Add selection to clicked option
    optionElement.classList.add('border-orange-500', 'bg-orange-50');
    const innerCircle = optionElement.querySelector('.bg-orange-500');
    if (innerCircle) innerCircle.classList.remove('hidden');
    selectedOption = index;
}

// Show feedback
function showFeedback(isCorrect, explanation) {
    if (feedbackIcon) {
        if (isCorrect) {
            feedbackIcon.innerHTML = '<i class="fas fa-check-circle text-green-500"></i>';
        } else {
            feedbackIcon.innerHTML = '<i class="fas fa-times-circle text-red-500"></i>';
        }
    }
    
    if (feedbackTitle) {
        if (isCorrect) {
            feedbackTitle.textContent = '正解です！';
            feedbackTitle.className = 'text-2xl font-bold mb-2 text-green-600';
        } else {
            feedbackTitle.textContent = '不正解です';
            feedbackTitle.className = 'text-2xl font-bold mb-2 text-red-600';
        }
    }
    
    if (feedbackText) feedbackText.textContent = explanation;
    if (feedbackModal) feedbackModal.classList.remove('hidden');
}

// End quiz
function endQuiz() {
    quizCompleted = true;
    if (questionContainer) questionContainer.classList.add('hidden');
    if (scoreContainer) scoreContainer.classList.remove('hidden');
    
    if (scoreEl) scoreEl.textContent = score;
    if (maxScoreEl) maxScoreEl.textContent = questions.length;
    
    // Calculate percentage
    const percentage = (score / questions.length) * 100;
    
    // Set score message
    if (scoreMessage) {
        if (percentage >= 80) {
            scoreMessage.textContent = '素晴らしい！ あなたの日本語はとても上手です！';
            scoreMessage.className = 'text-green-600 font-medium mb-4';
        } else if (percentage >= 50) {
            scoreMessage.textContent = 'いいですね！ もっと練習すればもっと上手になります！';
            scoreMessage.className = 'text-orange-500 font-medium mb-4';
        } else {
            scoreMessage.textContent = '頑張ってください！ もっと勉強しましょう！';
            scoreMessage.className = 'text-red-500 font-medium mb-4';
        }
    }
}
