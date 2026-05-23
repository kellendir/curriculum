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
   3. HERO BANNER — subtle 3D tilt + cursor glow
   --------------------------------------------------------- */
const heroBanner = document.querySelector('.hero-banner');
const heroBannerGlow = heroBanner?.querySelector('.hero-banner-glow');

if (heroBanner) {
    const resetBanner = () => {
        heroBanner.style.transform = '';
        if (heroBannerGlow) heroBannerGlow.style.background = '';
    };

    heroBanner.addEventListener('mousemove', (e) => {
        const r = heroBanner.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) - 0.5;
        const py = ((e.clientY - r.top) / r.height) - 0.5;
        heroBanner.style.transform =
            `perspective(1400px) rotateY(${px * 4}deg) rotateX(${-py * 3}deg)`;

        if (heroBannerGlow) {
            const mx = (px + 0.5) * 100;
            const my = (py + 0.5) * 100;
            heroBannerGlow.style.background =
                `radial-gradient(circle at ${mx}% ${my}%, rgba(199, 17, 225, 0.18), transparent 55%)`;
        }
    });

    heroBanner.addEventListener('mouseleave', resetBanner);
}

/* ---------------------------------------------------------
   4. INTERSECTION OBSERVER (reveal-on-scroll)
   --------------------------------------------------------- */
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            
            // GSAP Chip Stagger Animation
            if (e.target.classList.contains('skills-grid')) {
                e.target.querySelectorAll('.skill-card').forEach((card, i) => {
                    gsap.to(card.querySelectorAll('.chip'), {
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        duration: 0.5,
                        delay: 0.1 + (i * 0.15),
                        ease: "back.out(1.5)"
                    });
                });
            }
            
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

// Initialize chips hidden so GSAP can animate them in
document.querySelectorAll('.skill-card .chip').forEach(chip => {
    gsap.set(chip, { opacity: 0, y: 15 });
});

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

/* =========================================================
   WOW EFFECTS
   ========================================================= */

// 2. CUSTOM CURSOR & MAGNETIC BUTTONS
const cursor = document.querySelector('.cursor');
const hoverElements = document.querySelectorAll('a, button, .btn');

if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
    let targetX = cursorX, targetY = cursorY;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    const updateCursor = () => {
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        });
    });
}



// 5. CANVAS SMOKE / FLUID TRAIL
const canvas = document.getElementById('canvas-bg');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 50 + 30; 
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = Math.random() * 1.5 - 0.75;
            this.life = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.color = Math.random() > 0.5 ? '127, 82, 255' : '199, 17, 225';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.size += 0.8; 
        }
        draw() {
            ctx.globalCompositeOperation = 'screen';
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, `rgba(${this.color}, ${this.life * 0.15})`);
            grad.addColorStop(1, `rgba(${this.color}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let isCanvasVisible = true;
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new IntersectionObserver((entries) => {
            isCanvasVisible = entries[0].isIntersecting;
        }, { rootMargin: '100px' }).observe(heroSection);
    }

    window.addEventListener('mousemove', (e) => {
        if(isCanvasVisible && Math.random() > 0.3) { 
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });

    const animateCanvas = () => {
        if (!isCanvasVisible && particles.length === 0) {
            requestAnimationFrame(animateCanvas);
            return;
        }
        
        ctx.clearRect(0, 0, width, height);
        for(let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if(particles[i].life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateCanvas);
    };
    animateCanvas();
}

// 6. BACKGROUND ICONS PARALLAX
gsap.utils.toArray('.skill-card').forEach(card => {
    const bgIcons = card.querySelectorAll('.bg-icon-wrap');
    if (bgIcons.length > 0) {
        gsap.to(bgIcons, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -40,
            rotation: 15,
            stagger: 0.1,
            ease: "none"
        });
    }
});

// 7. MOBILE ICONS SCROLL SEQUENCE
const mobileCard = document.querySelector('.mobile-card');
if (mobileCard) {
    const mobileIcons = mobileCard.querySelectorAll('.mobile-icon');
    if(mobileIcons.length > 0) {
        gsap.set(mobileIcons, { opacity: 0, y: 30, scale: 0.8 });
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: mobileCard,
                start: "top 85%",
                end: "bottom 30%",
                scrub: true
            }
        });
        
        mobileIcons.forEach((icon, i) => {
            tl.to(icon, { opacity: 1, y: 0, scale: 1, duration: 1 }, i > 0 ? "-=0.3" : undefined);
            
            if (i < mobileIcons.length - 1) {
                tl.to(icon, { opacity: 0, y: -40, scale: 0.8, duration: 1 }, "+=0.3");
            } else {
                tl.to({}, {duration: 1}); // extend timeline so last icon stays visible
            }
        });
    }
}
