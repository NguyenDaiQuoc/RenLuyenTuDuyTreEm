// Games Module

// Memory Game Variables
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;
const memoryEmojis = ['🍎', '🍌', '🍊', '🍇', '🐱', '🐶', '🚗', '⭐'];

// Pattern Game Variables
let patternScore = 0;
let currentPattern = null;

// Puzzle Game Variables
let puzzleState = [];
let puzzleMoves = 0;

// Start a game
function startGame(gameName) {
    // Hide games grid
    document.getElementById('gamesGrid').style.display = 'none';
    
    // Hide all game areas
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });
    
    // Show selected game
    switch(gameName) {
        case 'memory':
            document.getElementById('memoryGame').classList.add('active');
            initMemoryGame();
            break;
        case 'pattern':
            document.getElementById('patternGame').classList.add('active');
            initPatternGame();
            break;
        case 'puzzle':
            document.getElementById('puzzleGame').classList.add('active');
            initPuzzleGame();
            break;
    }
}

// Back to games list
function backToGames() {
    document.getElementById('gamesGrid').style.display = 'grid';
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });
}

// ========== MEMORY GAME ==========

function initMemoryGame() {
    memoryMoves = 0;
    matchedPairs = 0;
    flippedCards = [];
    
    // Create pairs of cards
    memoryCards = [...memoryEmojis, ...memoryEmojis];
    memoryCards.sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-back">❓</div>
            <div class="card-front">${emoji}</div>
        `;
        card.addEventListener('click', () => flipCard(card, index));
        grid.appendChild(card);
    });
    
    updateMemoryStats();
}

function flipCard(card, index) {
    // Ignore if already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Ignore if two cards are already flipped
    if (flippedCards.length >= 2) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push({ card, index });
    
    if (flippedCards.length === 2) {
        memoryMoves++;
        updateMemoryStats();
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.card.dataset.emoji === card2.card.dataset.emoji) {
        // Match found
        setTimeout(() => {
            card1.card.classList.add('matched');
            card2.card.classList.add('matched');
            matchedPairs++;
            updateMemoryStats();
            flippedCards = [];
            
            if (window.AppUtils) {
                window.AppUtils.showFeedback('🎉 Tìm được cặp!', 'success');
            }
            
            // Check if game is complete
            if (matchedPairs === memoryEmojis.length) {
                setTimeout(() => {
                    if (window.AnimationUtils) {
                        window.AnimationUtils.createConfetti();
                    }
                    if (window.AppUtils) {
                        window.AppUtils.showFeedback(`🏆 Hoàn thành! ${memoryMoves} nước đi`, 'success');
                    }
                }, 500);
            }
        }, 500);
    } else {
        // No match
        setTimeout(() => {
            card1.card.classList.remove('flipped');
            card2.card.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function updateMemoryStats() {
    document.getElementById('memoryMoves').textContent = memoryMoves;
    document.getElementById('memoryMatches').textContent = matchedPairs;
}

function resetMemoryGame() {
    initMemoryGame();
}

// ========== PATTERN GAME ==========

function initPatternGame() {
    patternScore = 0;
    document.getElementById('patternScore').textContent = patternScore;
    generatePattern();
}

function generatePattern() {
    const patterns = [
        // Arithmetic sequences
        { sequence: [2, 4, 6, 8], answer: 10, options: [10, 12, 9, 11] },
        { sequence: [1, 3, 5, 7], answer: 9, options: [9, 8, 10, 11] },
        { sequence: [5, 10, 15, 20], answer: 25, options: [25, 30, 20, 24] },
        { sequence: [3, 6, 9, 12], answer: 15, options: [15, 18, 14, 16] },
        { sequence: [10, 20, 30, 40], answer: 50, options: [50, 60, 45, 55] },
        // Geometric sequences
        { sequence: [2, 4, 8, 16], answer: 32, options: [32, 24, 28, 30] },
        { sequence: [1, 2, 4, 8], answer: 16, options: [16, 12, 10, 14] },
        // Other patterns
        { sequence: [1, 1, 2, 3], answer: 5, options: [5, 4, 6, 7] }, // Fibonacci
        { sequence: [10, 9, 8, 7], answer: 6, options: [6, 5, 7, 8] },
    ];
    
    currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    const display = document.getElementById('patternDisplay');
    display.innerHTML = '';
    
    currentPattern.sequence.forEach(num => {
        const item = document.createElement('div');
        item.className = 'pattern-item';
        item.textContent = num;
        display.appendChild(item);
    });
    
    // Add blank
    const blank = document.createElement('div');
    blank.className = 'pattern-item blank';
    blank.textContent = '?';
    display.appendChild(blank);
    
    // Display options
    const optionsContainer = document.getElementById('patternOptions');
    optionsContainer.innerHTML = '';
    
    currentPattern.options.sort(() => Math.random() - 0.5).forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'pattern-option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => checkPattern(option, optionDiv));
        optionsContainer.appendChild(optionDiv);
    });
    
    document.getElementById('nextPatternBtn').style.display = 'none';
}

function checkPattern(selected, element) {
    const allOptions = document.querySelectorAll('.pattern-option');
    allOptions.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (selected === currentPattern.answer) {
        element.style.background = 'var(--success-color)';
        element.style.color = 'white';
        patternScore++;
        document.getElementById('patternScore').textContent = patternScore;
        
        // Update blank with correct answer
        document.querySelector('.pattern-item.blank').textContent = selected;
        document.querySelector('.pattern-item.blank').classList.remove('blank');
        
        if (window.AppUtils) {
            window.AppUtils.showFeedback('🎉 Đúng rồi!', 'success');
        }
        
        if (window.AnimationUtils) {
            window.AnimationUtils.createConfetti();
        }
    } else {
        element.style.background = 'var(--primary-color)';
        element.style.color = 'white';
        
        // Highlight correct answer
        allOptions.forEach(opt => {
            if (parseInt(opt.textContent) === currentPattern.answer) {
                opt.style.background = 'var(--success-color)';
                opt.style.color = 'white';
            }
        });
        
        if (window.AppUtils) {
            window.AppUtils.showFeedback('😊 Chưa đúng! Đáp án đúng đã được đánh dấu', 'error');
        }
    }
    
    document.getElementById('nextPatternBtn').style.display = 'inline-block';
}

function nextPattern() {
    generatePattern();
}

// ========== PUZZLE GAME ==========

function initPuzzleGame() {
    puzzleMoves = 0;
    document.getElementById('puzzleMoves').textContent = puzzleMoves;
    
    // Create initial state (1-8 and empty)
    puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, null];
    
    // Shuffle (with valid moves only)
    for (let i = 0; i < 100; i++) {
        const emptyIndex = puzzleState.indexOf(null);
        const validMoves = getValidMoves(emptyIndex);
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        [puzzleState[emptyIndex], puzzleState[randomMove]] = [puzzleState[randomMove], puzzleState[emptyIndex]];
    }
    
    renderPuzzle();
}

function getValidMoves(emptyIndex) {
    const moves = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;
    
    // Up
    if (row > 0) moves.push(emptyIndex - 3);
    // Down
    if (row < 2) moves.push(emptyIndex + 3);
    // Left
    if (col > 0) moves.push(emptyIndex - 1);
    // Right
    if (col < 2) moves.push(emptyIndex + 1);
    
    return moves;
}

function renderPuzzle() {
    const grid = document.getElementById('puzzleGrid');
    grid.innerHTML = '';
    
    puzzleState.forEach((num, index) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        
        if (num === null) {
            piece.classList.add('empty');
        } else {
            piece.textContent = num;
            piece.addEventListener('click', () => movePiece(index));
        }
        
        grid.appendChild(piece);
    });
}

function movePiece(index) {
    const emptyIndex = puzzleState.indexOf(null);
    const validMoves = getValidMoves(emptyIndex);
    
    if (validMoves.includes(index)) {
        [puzzleState[emptyIndex], puzzleState[index]] = [puzzleState[index], puzzleState[emptyIndex]];
        puzzleMoves++;
        document.getElementById('puzzleMoves').textContent = puzzleMoves;
        renderPuzzle();
        
        // Check if solved
        if (isPuzzleSolved()) {
            setTimeout(() => {
                if (window.AnimationUtils) {
                    window.AnimationUtils.createConfetti();
                }
                if (window.AppUtils) {
                    window.AppUtils.showFeedback(`🏆 Hoàn thành! ${puzzleMoves} nước đi`, 'success');
                }
            }, 300);
        }
    }
}

function isPuzzleSolved() {
    for (let i = 0; i < 8; i++) {
        if (puzzleState[i] !== i + 1) return false;
    }
    return true;
}

function resetPuzzleGame() {
    initPuzzleGame();
}

// Export functions for global access
window.startGame = startGame;
window.backToGames = backToGames;
window.resetMemoryGame = resetMemoryGame;
window.nextPattern = nextPattern;
window.resetPuzzleGame = resetPuzzleGame;
