// ===========================
// Batman Easter Egg
// ===========================
const profileImg = document.querySelector('.profile-image');
const shades = document.querySelector('.img_shades');

if (profileImg) {
    profileImg.addEventListener('mouseenter', () => {
        if (shades) shades.style.visibility = 'visible';

        const popup = document.createElement('div');
        popup.className = 'batman-popup';
        popup.textContent = '🦇 I am Batman.';
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 2000);
    });

    profileImg.addEventListener('mouseleave', () => {
        if (shades) shades.style.visibility = 'hidden';
    });
}

// ===========================
// Typewriter Effect (index only)
// ===========================
const typewriterEl = document.getElementById('typewriter');

if (typewriterEl) {
    const phrases = [
        'backend engineer.',
        'kubernetes wrangler.',
        'distributed systems nerd.',
        'open source contributor.',
        'pizza & code enthusiast.',
        'tech blogger on Medium.',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = current.slice(0, --charIndex);
        } else {
            typewriterEl.textContent = current.slice(0, ++charIndex);
        }

        if (!isDeleting && charIndex === current.length) {
            // Pause at end of phrase before deleting
            setTimeout(() => {
                isDeleting = true;
                tick();
            }, 1800);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            // Pause before typing next phrase
            setTimeout(tick, 400);
            return;
        }

        setTimeout(tick, isDeleting ? 40 : 80);
    }

    tick();
}

// ===========================
// Smooth scroll for anchor links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
