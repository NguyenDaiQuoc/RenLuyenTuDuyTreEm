// Main JavaScript for the website

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    };

    // Intersection Observer for counter animation
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));

    // Add click sound effect (optional)
    const buttons = document.querySelectorAll('.btn, .feature-card');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('bounce');
            setTimeout(() => {
                this.classList.remove('bounce');
            }, 500);
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Show feedback messages
function showFeedback(message, type = 'success') {
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#95E1D3' : '#FF6B6B'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        font-weight: bold;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 500);
    }, 3000);
}

// Save progress to localStorage
function saveProgress(subject, lesson, score) {
    const progress = JSON.parse(localStorage.getItem('learning_progress') || '{}');
    if (!progress[subject]) {
        progress[subject] = {};
    }
    progress[subject][lesson] = {
        score: score,
        date: new Date().toISOString(),
        completed: score >= 70
    };
    localStorage.setItem('learning_progress', JSON.stringify(progress));
}

// Get progress from localStorage
function getProgress(subject, lesson) {
    const progress = JSON.parse(localStorage.getItem('learning_progress') || '{}');
    return progress[subject] && progress[subject][lesson] ? progress[subject][lesson] : null;
}

// Play sound effect (optional enhancement)
function playSound(type) {
    // This can be implemented with Web Audio API or <audio> elements
    // For now, we'll use visual feedback
    console.log(`Playing ${type} sound`);
}

// Export functions for use in other scripts
window.AppUtils = {
    showFeedback,
    saveProgress,
    getProgress,
    playSound
};
