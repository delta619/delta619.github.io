// Motion is progressive enhancement; content remains visible without JavaScript.
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const surfaces = [...document.querySelectorAll('[data-tilt]')];
    const scene = document.querySelector('.scene');
    const hero = document.querySelector('.hero');
    let frame = 0;
    let activeSurface = null;
    let pointerX = 0;
    let pointerY = 0;

    function render() {
        frame = 0;
        if (reducedMotion.matches) return;
        if (activeSurface && finePointer.matches) {
            const bounds = activeSurface.getBoundingClientRect();
            const strength = activeSurface === scene ? 10 : 4;
            const x = Math.max(-.5, Math.min(.5, (pointerX - bounds.left) / bounds.width - .5));
            const y = Math.max(-.5, Math.min(.5, (pointerY - bounds.top) / bounds.height - .5));
            activeSurface.style.setProperty('--rx', `${-y * strength}deg`);
            activeSurface.style.setProperty('--ry', `${x * strength}deg`);
        }
        if (scene && hero && finePointer.matches) {
            const bounds = hero.getBoundingClientRect();
            const offset = Math.max(-30, Math.min(30, -bounds.top * .07));
            scene.style.setProperty('--scroll-y', `${offset}px`);
        }
    }
    function schedule() {
        if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(render);
    }
    function reset(surface) {
        surface.style.removeProperty('--rx');
        surface.style.removeProperty('--ry');
        surface.style.removeProperty('--scroll-y');
    }
    surfaces.forEach(surface => {
        surface.addEventListener('pointermove', event => {
            if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
            activeSurface = surface;
            pointerX = event.clientX;
            pointerY = event.clientY;
            schedule();
        });
        surface.addEventListener('pointerleave', () => {
            if (activeSurface === surface) activeSurface = null;
            reset(surface);
        });
    });
    function updatePreferences() {
        activeSurface = null;
        surfaces.forEach(reset);
        schedule();
    }
    reducedMotion.addEventListener('change', updatePreferences);
    finePointer.addEventListener('change', updatePreferences);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
})();
