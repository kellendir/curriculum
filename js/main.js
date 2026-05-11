/* =========================================================
   Kirtash Dev · Portfolio
   Main entry — all interactive behaviour lives here.
   ========================================================= */

/* ---------------------------------------------------------
   1. SCROLL PROGRESS + NAV STATE
   --------------------------------------------------------- */
const progress = document.getElementById('scrollProgress');
const nav = document.getElementById('nav');

const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = scrolled + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 20);
};

/* ---------------------------------------------------------
   2. PARALLAX ORBS (mouse + scroll)
   --------------------------------------------------------- */
const orbs = document.querySelectorAll('[data-parallax]');
let mouseX = 0;
let mouseY = 0;
let scrollY = 0;

const updateParallax = () => {
    orbs.forEach(orb => {
        const depth = parseFloat(orb.dataset.parallax);
        const tx = mouseX * 40 * depth;
        const ty = mouseY * 40 * depth + scrollY * depth * 0.3;
        orb.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
};

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    updateParallax();
}, { passive: true });

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    onScroll();
    updateParallax();
}, { passive: true });

/* ---------------------------------------------------------
   3. PHONE 3D TILT (mouse)
   --------------------------------------------------------- */
const phone = document.getElementById('phone');
const phoneWrap = phone?.parentElement;

if (phone && phoneWrap) {
    phoneWrap.addEventListener('mousemove', (e) => {
        const r = phoneWrap.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) - 0.5;
        const py = ((e.clientY - r.top) / r.height) - 0.5;
        phone.style.transform =
            `perspective(1200px) rotateY(${-12 + px * 14}deg) rotateX(${4 - py * 12}deg)`;
    });
    phoneWrap.addEventListener('mouseleave', () => {
        phone.style.transform = 'perspective(1200px) rotateY(-12deg) rotateX(4deg)';
    });
}

/* ---------------------------------------------------------
   4. INTERSECTION OBSERVER (reveal-on-scroll)
   --------------------------------------------------------- */
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

/* ---------------------------------------------------------
   5. ACTIVE NAV LINK (scroll-spy)
   --------------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const id = e.target.id;
            navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
        }
    });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => spy.observe(s));

/* ---------------------------------------------------------
   6. COUNT-UP STATS
   --------------------------------------------------------- */
const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target);
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};

const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCount(e.target);
            countObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

/* ---------------------------------------------------------
   7. LANGUAGE BARS
   --------------------------------------------------------- */
const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.level + '%';
            barObs.unobserve(e.target);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.lang-bar-fill').forEach(el => barObs.observe(el));

/* ---------------------------------------------------------
   8. SKILL CARD SPOTLIGHT (cursor follow)
   --------------------------------------------------------- */
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
});

/* ---------------------------------------------------------
   Initial paint
   --------------------------------------------------------- */
onScroll();
updateParallax();
