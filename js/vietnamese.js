// Vietnamese Learning Module

const vietnameseAlphabet = [
    'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M',
    'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'
];

const vocabularyWords = [
    { word: 'Táo', emoji: '🍎', meaning: 'trái táo' },
    { word: 'Chuối', emoji: '🍌', meaning: 'trái chuối' },
    { word: 'Mèo', emoji: '🐱', meaning: 'con mèo' },
    { word: 'Chó', emoji: '🐶', meaning: 'con chó' },
    { word: 'Nhà', emoji: '🏠', meaning: 'ngôi nhà' },
    { word: 'Ô tô', emoji: '🚗', meaning: 'xe ô tô' },
    { word: 'Sách', emoji: '📚', meaning: 'quyển sách' },
    { word: 'Bút', emoji: '✏️', meaning: 'cây bút' },
    { word: 'Hoa', emoji: '🌸', meaning: 'bông hoa' },
    { word: 'Cây', emoji: '🌳', meaning: 'cái cây' },
    { word: 'Nước', emoji: '💧', meaning: 'nước uống' },
    { word: 'Mặt trời', emoji: '☀️', meaning: 'mặt trời' },
    { word: 'Mặt trăng', emoji: '🌙', meaning: 'mặt trăng' },
    { word: 'Ngôi sao', emoji: '⭐', meaning: 'ngôi sao' }
];

const sentenceTemplates = [
    {
        sentence: ['Bé', 'thích', 'ăn', 'táo'],
        correct: 'Bé thích ăn táo'
    },
    {
        sentence: ['Con', 'mèo', 'ngủ', 'trên', 'ghế'],
        correct: 'Con mèo ngủ trên ghế'
    },
    {
        sentence: ['Mẹ', 'đi', 'chợ', 'mua', 'rau'],
        correct: 'Mẹ đi chợ mua rau'
    },
    {
        sentence: ['Em', 'đọc', 'sách', 'mỗi', 'ngày'],
        correct: 'Em đọc sách mỗi ngày'
    }
];

const quizQuestions = [
    {
        question: 'Từ nào dưới đây có nghĩa là con vật nuôi trong nhà?',
        options: ['Mèo', 'Cây', 'Sách', 'Ô tô'],
        answer: 'Mèo'
    },
    {
        question: 'Từ nào là trái cây?',
        options: ['Nhà', 'Táo', 'Chó', 'Bút'],
        answer: 'Táo'
    },
    {
        question: 'Chúng ta dùng gì để viết?',
        options: ['Bút', 'Hoa', 'Nước', 'Cây'],
        answer: 'Bút'
    },
    {
        question: 'Từ nào chỉ nơi ở của người?',
        options: ['Mặt trời', 'Nhà', 'Ngôi sao', 'Chuối'],
        answer: 'Nhà'
    }
];

let currentLesson = 'alphabet';
let currentWordIndex = 0;
let currentSentence = [];
let quizScore = 0;
let currentQuizQuestion = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Lesson selector
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach(card => {
        card.addEventListener('click', function() {
            lessonCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentLesson = this.getAttribute('data-lesson');
            loadLesson(currentLesson);
        });
    });

    // Load initial lesson
    loadLesson('alphabet');
});

function loadLesson(lesson) {
    const learningArea = document.getElementById('learningArea');
    
    switch(lesson) {
        case 'alphabet':
            showAlphabetLesson(learningArea);
            break;
        case 'words':
            showWordLesson(learningArea);
            break;
        case 'sentences':
            showSentenceLesson(learningArea);
            break;
        case 'quiz':
            showQuizLesson(learningArea);
            break;
    }
}

function showAlphabetLesson(container) {
    container.innerHTML = `
        <h2 class="section-title" style="font-size: 2rem;">Bảng Chữ Cái Tiếng Việt 🔤</h2>
        <p style="text-align: center; font-size: 1.2rem; margin-bottom: 1rem;">
            Nhấn vào từng chữ cái để nghe cách phát âm! 🔊
        </p>
        <div class="alphabet-grid" id="alphabetGrid"></div>
    `;

    const grid = document.getElementById('alphabetGrid');
    vietnameseAlphabet.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.innerHTML = `
            <div style="font-size: 2.5rem;">${letter}</div>
            <div style="font-size: 0.9rem;">${letter.toLowerCase()}</div>
        `;
        card.addEventListener('click', function() {
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 500);
            
            // Visual feedback
            if (window.AppUtils) {
                window.AppUtils.showFeedback(`Chữ ${letter}`, 'success');
            }
        });
        grid.appendChild(card);
    });
}

function showWordLesson(container) {
    const word = vocabularyWords[currentWordIndex];
    
    container.innerHTML = `
        <h2 class="section-title" style="font-size: 2rem;">Học Từ Vựng 📖</h2>
        <div class="word-display">
            <div class="word-image">${word.emoji}</div>
            <div class="word-text">${word.word}</div>
            <div class="word-pronunciation">(${word.meaning})</div>
        </div>
        <div class="control-buttons">
            <button class="btn btn-secondary" onclick="previousWord()">⬅️ Từ Trước</button>
            <button class="btn btn-primary" onclick="nextWord()">Từ Tiếp ➡️</button>
        </div>
        <div style="text-align: center; margin-top: 2rem; color: #666;">
            Từ ${currentWordIndex + 1} / ${vocabularyWords.length}
        </div>
    `;
}

function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % vocabularyWords.length;
    const container = document.getElementById('learningArea');
    showWordLesson(container);
}

function previousWord() {
    currentWordIndex = (currentWordIndex - 1 + vocabularyWords.length) % vocabularyWords.length;
    const container = document.getElementById('learningArea');
    showWordLesson(container);
}

function showSentenceLesson(container) {
    const template = sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)];
    currentSentence = [];
    
    container.innerHTML = `
        <h2 class="section-title" style="font-size: 2rem;">Ghép Câu ✍️</h2>
        <p style="text-align: center; font-size: 1.2rem; margin-bottom: 2rem;">
            Chọn các từ để tạo thành câu có nghĩa! 💡
        </p>
        <div class="sentence-builder">
            <div class="word-bank" id="wordBank"></div>
            <div class="sentence-area" id="sentenceArea">
                <div style="color: #999;">Nhấn vào từ để thêm vào câu...</div>
            </div>
        </div>
        <div class="control-buttons">
            <button class="btn btn-secondary" onclick="clearSentence()">🔄 Xóa Hết</button>
            <button class="btn btn-primary" onclick="checkSentence('${template.correct}')">✅ Kiểm Tra</button>
        </div>
    `;

    const wordBank = document.getElementById('wordBank');
    // Shuffle words
    const shuffled = [...template.sentence].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((word, index) => {
        const chip = document.createElement('div');
        chip.className = 'word-chip';
        chip.textContent = word;
        chip.dataset.word = word;
        chip.dataset.index = index;
        chip.addEventListener('click', function() {
            if (!this.classList.contains('used')) {
                addWordToSentence(word, this);
            }
        });
        wordBank.appendChild(chip);
    });
}

function addWordToSentence(word, chipElement) {
    currentSentence.push(word);
    chipElement.classList.add('used');
    
    const sentenceArea = document.getElementById('sentenceArea');
    
    // Clear placeholder if exists
    if (sentenceArea.querySelector('div[style*="color: #999"]')) {
        sentenceArea.innerHTML = '';
    }
    
    const wordElement = document.createElement('div');
    wordElement.className = 'sentence-word';
    wordElement.textContent = word;
    wordElement.addEventListener('click', function() {
        removeWordFromSentence(word, this, chipElement);
    });
    
    sentenceArea.appendChild(wordElement);
}

function removeWordFromSentence(word, wordElement, chipElement) {
    const index = currentSentence.indexOf(word);
    if (index > -1) {
        currentSentence.splice(index, 1);
    }
    
    wordElement.remove();
    chipElement.classList.remove('used');
    
    // Add placeholder if empty
    const sentenceArea = document.getElementById('sentenceArea');
    if (sentenceArea.children.length === 0) {
        sentenceArea.innerHTML = '<div style="color: #999;">Nhấn vào từ để thêm vào câu...</div>';
    }
}

function clearSentence() {
    currentSentence = [];
    const sentenceArea = document.getElementById('sentenceArea');
    sentenceArea.innerHTML = '<div style="color: #999;">Nhấn vào từ để thêm vào câu...</div>';
    
    const chips = document.querySelectorAll('.word-chip');
    chips.forEach(chip => chip.classList.remove('used'));
}

function checkSentence(correctSentence) {
    const userSentence = currentSentence.join(' ');
    
    if (userSentence === correctSentence) {
        if (window.AppUtils) {
            window.AppUtils.showFeedback('🎉 Chính xác! Bé ghép câu giỏi lắm!', 'success');
        }
        if (window.AnimationUtils) {
            window.AnimationUtils.createConfetti();
        }
        
        // Load new sentence after delay
        setTimeout(() => {
            const container = document.getElementById('learningArea');
            showSentenceLesson(container);
        }, 2000);
    } else {
        if (window.AppUtils) {
            window.AppUtils.showFeedback('😊 Chưa đúng! Thử lại nhé!', 'error');
        }
    }
}

function showQuizLesson(container) {
    if (currentQuizQuestion >= quizQuestions.length) {
        showQuizResults(container);
        return;
    }
    
    const question = quizQuestions[currentQuizQuestion];
    
    container.innerHTML = `
        <h2 class="section-title" style="font-size: 2rem;">Trắc Nghiệm ❓</h2>
        <div style="text-align: center; margin-bottom: 2rem; color: #666;">
            Câu ${currentQuizQuestion + 1} / ${quizQuestions.length}
        </div>
        <div class="quiz-question">${question.question}</div>
        <div class="quiz-options" id="quizOptions"></div>
        <div style="text-align: center; margin-top: 2rem;">
            <span class="score-display">⭐ Điểm: ${quizScore}</span>
        </div>
    `;

    const optionsContainer = document.getElementById('quizOptions');
    question.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', function() {
            checkQuizAnswer(option, question.answer, this);
        });
        optionsContainer.appendChild(optionDiv);
    });
}

function checkQuizAnswer(selected, correct, element) {
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (selected === correct) {
        element.classList.add('correct');
        quizScore++;
        if (window.AppUtils) {
            window.AppUtils.showFeedback('🎉 Đúng rồi!', 'success');
        }
    } else {
        element.classList.add('wrong');
        // Highlight correct answer
        allOptions.forEach(opt => {
            if (opt.textContent === correct) {
                opt.classList.add('correct');
            }
        });
        if (window.AppUtils) {
            window.AppUtils.showFeedback('😊 Chưa đúng! Đáp án đúng đã được đánh dấu', 'error');
        }
    }
    
    currentQuizQuestion++;
    
    setTimeout(() => {
        const container = document.getElementById('learningArea');
        showQuizLesson(container);
    }, 2000);
}

function showQuizResults(container) {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    let message, emoji;
    
    if (percentage >= 80) {
        message = 'Xuất sắc! Bé học rất tốt! 🌟';
        emoji = '🏆';
    } else if (percentage >= 60) {
        message = 'Giỏi lắm! Tiếp tục phát huy nhé! 👏';
        emoji = '⭐';
    } else {
        message = 'Cố gắng lên! Thử lại nhé! 💪';
        emoji = '💝';
    }
    
    container.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">${emoji}</div>
            <h2 class="section-title" style="font-size: 2rem;">${message}</h2>
            <div class="score-display" style="font-size: 2rem; margin: 2rem 0;">
                Điểm: ${quizScore}/${quizQuestions.length} (${percentage}%)
            </div>
            <div class="control-buttons">
                <button class="btn btn-large btn-primary" onclick="restartQuiz()">
                    Làm Lại 🔄
                </button>
                <button class="btn btn-large btn-secondary" onclick="location.href='index.html'">
                    Về Trang Chủ 🏠
                </button>
            </div>
        </div>
    `;
    
    if (window.AnimationUtils) {
        window.AnimationUtils.createConfetti();
    }
}

function restartQuiz() {
    currentQuizQuestion = 0;
    quizScore = 0;
    const container = document.getElementById('learningArea');
    showQuizLesson(container);
}

// Export functions for global access
window.nextWord = nextWord;
window.previousWord = previousWord;
window.clearSentence = clearSentence;
window.checkSentence = checkSentence;
window.restartQuiz = restartQuiz;
