// Animation utilities

// Add animation to element
function addAnimation(element, animationClass, duration = 1000) {
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
}

// Confetti animation for success
function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const leftPos = Math.random() * 100;
        const rotation = Math.random() * 360;
        const duration = 2 + Math.random() * 2;
        const translateX = Math.random() * 200 - 100;
        const finalRotation = Math.random() * 720;
        
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            left: ${leftPos}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${rotation}deg);
            animation: fall-${i} ${duration}s linear forwards;
            pointer-events: none;
            z-index: 10000;
        `;
        
        // Create unique animation for each confetti
        const keyframes = `
            @keyframes fall-${i} {
                to {
                    top: 100vh;
                    opacity: 0;
                    transform: translateX(${translateX}px) rotate(${finalRotation}deg);
                }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
            styleSheet.remove();
        }, duration * 1000 + 100);
    }
}

// Add CSS for slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(120%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize animations on load
document.addEventListener('DOMContentLoaded', function() {
    animateOnScroll();
});

// Export animation functions
window.AnimationUtils = {
    addAnimation,
    createConfetti,
    animateOnScroll
};
