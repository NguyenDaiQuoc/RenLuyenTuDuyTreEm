// Math Learning Module

let currentLevel = 'counting';
let currentQuestion = 0;
let score = 0;
// Total questions per session - can be adjusted based on difficulty level
let totalQuestions = 10;
let currentAnswer = null;

const emojis = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍒', '🥝', '🍑', '🍍'];

// Initialize the math module
document.addEventListener('DOMContentLoaded', function() {
    // Level selector buttons
    const levelButtons = document.querySelectorAll('.level-btn');
    levelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            levelButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLevel = this.getAttribute('data-level');
            resetGame();
            generateQuestion();
        });
    });

    // Next button
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.addEventListener('click', function() {
        if (currentQuestion < totalQuestions) {
            generateQuestion();
            this.style.display = 'none';
        } else {
            showCompletionScreen();
        }
    });

    // Start the first question
    setTimeout(() => {
        generateQuestion();
    }, 1000);
});

function resetGame() {
    currentQuestion = 0;
    score = 0;
    updateScore();
    updateProgress();
}

function generateQuestion() {
    currentQuestion++;
    currentAnswer = null;
    
    const questionEl = document.getElementById('question');
    const visualAidsEl = document.getElementById('visualAids');
    const answerOptionsEl = document.getElementById('answerOptions');
    
    // Clear previous content
    visualAidsEl.innerHTML = '';
    answerOptionsEl.innerHTML = '';
    
    let question, answer, options;
    
    switch(currentLevel) {
        case 'counting':
            ({ question, answer, options } = generateCountingQuestion());
            break;
        case 'addition':
            ({ question, answer, options } = generateAdditionQuestion());
            break;
        case 'subtraction':
            ({ question, answer, options } = generateSubtractionQuestion());
            break;
        case 'mixed':
            ({ question, answer, options } = generateMixedQuestion());
            break;
    }
    
    currentAnswer = answer;
    questionEl.textContent = question;
    
    // Create answer buttons
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(option, btn));
        answerOptionsEl.appendChild(btn);
    });
    
    updateProgress();
}

function generateCountingQuestion() {
    const count = Math.floor(Math.random() * 9) + 1; // 1-9
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const visualAidsEl = document.getElementById('visualAids');
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.className = 'visual-item';
        item.textContent = emoji;
        item.style.animationDelay = `${i * 0.1}s`;
        visualAidsEl.appendChild(item);
    }
    
    const question = `Đếm xem có bao nhiêu ${emoji}?`;
    const answer = count;
    const options = generateOptions(answer, 0, 10);
    
    return { question, answer, options };
}

function generateAdditionQuestion() {
    const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
    const emoji1 = emojis[Math.floor(Math.random() * emojis.length)];
    const emoji2 = emojis[Math.floor(Math.random() * emojis.length)];
    
    const visualAidsEl = document.getElementById('visualAids');
    
    // Show first group
    for (let i = 0; i < num1; i++) {
        const item = document.createElement('div');
        item.className = 'visual-item';
        item.textContent = emoji1;
        item.style.animationDelay = `${i * 0.1}s`;
        visualAidsEl.appendChild(item);
    }
    
    // Add plus sign
    const plus = document.createElement('div');
    plus.className = 'visual-item';
    plus.textContent = '➕';
    plus.style.fontSize = '2rem';
    visualAidsEl.appendChild(plus);
    
    // Show second group
    for (let i = 0; i < num2; i++) {
        const item = document.createElement('div');
        item.className = 'visual-item';
        item.textContent = emoji2;
        item.style.animationDelay = `${(num1 + i) * 0.1}s`;
        visualAidsEl.appendChild(item);
    }
    
    const question = `${num1} ➕ ${num2} = ?`;
    const answer = num1 + num2;
    const options = generateOptions(answer, 0, 20);
    
    return { question, answer, options };
}

function generateSubtractionQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 5; // 5-14
    const num2 = Math.floor(Math.random() * num1) + 1; // 1 to num1
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const visualAidsEl = document.getElementById('visualAids');
    
    // Show all items
    for (let i = 0; i < num1; i++) {
        const item = document.createElement('div');
        item.className = 'visual-item';
        item.textContent = emoji;
        item.style.animationDelay = `${i * 0.1}s`;
        
        // Gray out items to subtract
        if (i >= num1 - num2) {
            item.style.opacity = '0.3';
            item.style.textDecoration = 'line-through';
        }
        
        visualAidsEl.appendChild(item);
    }
    
    const question = `${num1} ➖ ${num2} = ?`;
    const answer = num1 - num2;
    const options = generateOptions(answer, 0, num1);
    
    return { question, answer, options };
}

function generateMixedQuestion() {
    const type = Math.random() > 0.5 ? 'add' : 'subtract';
    
    if (type === 'add') {
        return generateAdditionQuestion();
    } else {
        return generateSubtractionQuestion();
    }
}

function generateOptions(correctAnswer, min, max) {
    const options = new Set([correctAnswer]);
    
    while (options.size < 4) {
        const option = Math.floor(Math.random() * (max - min + 1)) + min;
        if (option >= 0) {
            options.add(option);
        }
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5);
}

function checkAnswer(selected, button) {
    // Disable all buttons
    const allButtons = document.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => btn.style.pointerEvents = 'none');
    
    if (selected === currentAnswer) {
        button.classList.add('correct');
        score++;
        updateScore();
        
        // Show confetti
        if (window.AnimationUtils) {
            window.AnimationUtils.createConfetti();
        }
        
        // Play success feedback
        if (window.AppUtils) {
            window.AppUtils.showFeedback('🎉 Giỏi lắm! Đúng rồi!', 'success');
        }
    } else {
        button.classList.add('wrong');
        
        // Highlight correct answer
        allButtons.forEach(btn => {
            if (parseInt(btn.textContent) === currentAnswer) {
                btn.classList.add('correct');
            }
        });
        
        if (window.AppUtils) {
            window.AppUtils.showFeedback('😊 Chưa đúng! Thử lại lần sau nhé!', 'error');
        }
    }
    
    // Show next button
    setTimeout(() => {
        document.getElementById('nextBtn').style.display = 'inline-block';
    }, 1500);
    
    // Save progress
    if (window.AppUtils) {
        window.AppUtils.saveProgress('math', currentLevel, (score / currentQuestion) * 100);
    }
}

function updateScore() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('totalQuestions').textContent = currentQuestion;
}

function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function showCompletionScreen() {
    const exerciseArea = document.getElementById('exerciseArea');
    const percentage = Math.round((score / totalQuestions) * 100);
    
    let message, emoji;
    if (percentage >= 90) {
        message = 'Xuất sắc! Bé thật tuyệt vời! 🌟';
        emoji = '🏆';
    } else if (percentage >= 70) {
        message = 'Giỏi lắm! Bé làm tốt lắm! 👏';
        emoji = '⭐';
    } else if (percentage >= 50) {
        message = 'Khá tốt! Tiếp tục cố gắng nhé! 💪';
        emoji = '👍';
    } else {
        message = 'Chưa sao! Cùng thử lại nhé! 😊';
        emoji = '💝';
    }
    
    exerciseArea.innerHTML = `
        <div class="question" style="font-size: 5rem;">${emoji}</div>
        <div class="question">${message}</div>
        <div class="score-display" style="font-size: 2rem; margin: 2rem 0;">
            Điểm: ${score}/${totalQuestions} (${percentage}%)
        </div>
        <button class="btn btn-large btn-primary" onclick="location.reload()">
            Học Lại 🔄
        </button>
        <button class="btn btn-large btn-secondary" onclick="location.href='index.html'" style="margin-left: 1rem;">
            Về Trang Chủ 🏠
        </button>
    `;
    
    // Show confetti for completion
    if (window.AnimationUtils) {
        window.AnimationUtils.createConfetti();
    }
}
