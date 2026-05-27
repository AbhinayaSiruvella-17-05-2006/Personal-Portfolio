/* ================================================
   PROFESSIONAL PORTFOLIO - JAVASCRIPT
   Advanced Interactions & Animations
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');

    function hidePreloader() {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initAnimations();
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 500);
    } else {
        setTimeout(hidePreloader, 2000);
        window.addEventListener('load', () => {
            setTimeout(hidePreloader, 500);
        });
    }

    // ========== PARTICLE ANIMATION ==========
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 80;

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(14, 165, 233, ${0.15 * (1 - dist / 150)})`;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // ========== CUSTOM CURSOR ==========
    const cursorWrapper = document.getElementById('cursor-wrapper');
    const cursorInner = document.getElementById('cursor-inner');
    const cursorOuter = document.getElementById('cursor-outer');

    if (cursorInner && cursorOuter && window.innerWidth > 768) {
        let mouseX = 0;
        let mouseY = 0;
        let outerX = 0;
        let outerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorInner.style.left = `${mouseX}px`;
            cursorInner.style.top = `${mouseY}px`;
        });

        function animateOuterCursor() {
            outerX += (mouseX - outerX) * 0.1;
            outerY += (mouseY - outerY) * 0.1;
            cursorOuter.style.left = `${outerX}px`;
            cursorOuter.style.top = `${outerY}px`;
            requestAnimationFrame(animateOuterCursor);
        }
        animateOuterCursor();

        const hoverElements = document.querySelectorAll('a, button, .cert-card, .project-card, .chip, .highlight-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorWrapper.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorWrapper.classList.remove('hover'));
        });
    }

    // ========== NAVBAR SCROLL ==========
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // ========== MOBILE MENU ==========
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileClose?.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========== TYPING EFFECT ==========
    const typedElement = document.getElementById('typed-text');
    const phrases = [
        'Software Developer',
    'Full Stack Developer',
    'AI & ML Enthusiast',
    'Data Analytics Enthusiast',
    'Problem Solver'
    ];

    if (typedElement) {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        setTimeout(typeEffect, 1000);
    }

    // ========== COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });

        countersAnimated = true;
    }

    // ========== TAB FUNCTIONALITY ==========
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const panel = document.getElementById(`${tabId}-panel`);
            if (panel) {
                panel.classList.add('active');
                animatePanelItems(panel);
            }
        });
    });

    function animatePanelItems(panel) {
        const items = panel.querySelectorAll('.skill-category, .timeline-item, .education-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // ========== CERTIFICATION FILTERS ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const certCards = document.querySelectorAll('.cert-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            certCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';

                setTimeout(() => {
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, index * 30);
                    } else {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                    }
                }, 200);
            });
        });
    });
    // ===== COURSE SUB FILTERS =====

const courseSubfilters =
document.getElementById('course-subfilters');

const subFilterBtns =
document.querySelectorAll('.sub-filter-btn');


// Show/Hide Course Categories

filterBtns.forEach(btn => {

    btn.addEventListener('click', () => {

        const filter =
        btn.getAttribute('data-filter');

        if(filter === 'course'){
            courseSubfilters.classList.add('active');
        }
        else{
            courseSubfilters.classList.remove('active');
        }

    });

});


// Filter Course Providers

subFilterBtns.forEach(btn => {

    btn.addEventListener('click', () => {

        const provider =
        btn.dataset.provider;

        subFilterBtns.forEach(b =>
            b.classList.remove('active'));

        btn.classList.add('active');

        certCards.forEach(card => {

            if(
                card.dataset.category !== 'course'
            ){
                return;
            }

            const cardProvider =
            card.dataset.provider;

            if(
                provider === 'allcourses' ||
                cardProvider === provider
            ){
                card.style.display = 'block';
            }
            else{
                card.style.display = 'none';
            }

        });

    });

});

    // ========== CERTIFICATE MODAL ==========
    const certModal = document.getElementById('cert-modal');
    const certViewer = document.getElementById('cert-viewer');
    const modalClose = document.getElementById('modal-close');
    const certViewBtns = document.querySelectorAll('.cert-view-btn');

    function openCertModal(url) {
        if (!certModal || !certViewer) return;

        // Convert Google Drive URL to preview format
        const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        let embedUrl = url;

        if (driveMatch && driveMatch[1]) {
            embedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
        }

        certViewer.src = embedUrl;
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCertModal() {
        if (!certModal || !certViewer) return;
        certModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => certViewer.src = '', 300);
    }

    certViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            if (url) openCertModal(url);
        });
    });

    modalClose?.addEventListener('click', closeCertModal);

    certModal?.addEventListener('click', (e) => {
        if (e.target === certModal) closeCertModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal?.classList.contains('active')) {
            closeCertModal();
        }
    });

    // ========== BACK TO TOP ==========
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== SCROLL REVEAL ==========
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.project-card, .cert-card, .highlight-card, .info-card');

        reveals.forEach((el, index) => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                if (!el.classList.contains('revealed')) {
                    el.style.transitionDelay = `${index * 0.05}s`;
                    el.classList.add('revealed');
                }
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);

    // ========== TILT EFFECT ==========
    const tiltCards = document.querySelectorAll('.project-card, .cert-inner');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========== INITIALIZE ANIMATIONS ==========
    function initAnimations() {
        // Check if hero stats are visible
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersAnimated) {
                        animateCounters();
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(heroStats);
        }

        revealOnScroll();

        // Animate first tab content
        const firstPanel = document.querySelector('.tab-panel.active');
        if (firstPanel) {
            animatePanelItems(firstPanel);
        }
    }

    // ========== MAGNETIC BUTTONS ==========
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .contact-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ========== RIPPLE EFFECT ==========
    const rippleBtns = document.querySelectorAll('.filter-btn, .tab-btn, .btn');

    rippleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: translate(-50%, -50%);
                animation: ripple-expand 0.6s ease-out forwards;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;

            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-expand {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ========== PARALLAX EFFECT ==========
    const heroGraphic = document.querySelector('.hero-graphic');

    if (heroGraphic) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroGraphic.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
        });
    }

    // ========== CONSOLE MESSAGE ==========
    console.log('%c Welcome to my Portfolio! ', 'background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: #030712; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
    console.log('%c Built with passion and creativity ', 'color: #0ea5e9; font-size: 14px;');

});
