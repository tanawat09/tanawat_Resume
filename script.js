// ============================================
// TANAWAT NOIPALEE - Resume Website Scripts
// Light Theme Version
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // TYPING EFFECT
    // ============================================
    const typingEl = document.getElementById('typingText');
    const phrases = [
        'สวัสดีครับ ยินดีต้อนรับ',
        'ผมเป็น IT Professional',
        'Network & System Admin',
        'Programmer & Developer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            speed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }
    typeEffect();

    // ============================================
    // NAVBAR
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = navLinks.querySelector(`a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);

                // Animate skill fills
                entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                    setTimeout(() => fill.classList.add('animated'), 300);
                });

                // Animate language bars
                entry.target.querySelectorAll('.lang-fill').forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    setTimeout(() => { fill.style.width = width + '%'; }, 300);
                });

                // Animate salary bar
                const salaryFill = entry.target.querySelector('.salary-fill');
                if (salaryFill) setTimeout(() => salaryFill.classList.add('animated'), 300);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    function animateCounter(el, target) {
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);

        function update() {
            current += step;
            if (current >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
        update();
    }

    // ============================================
    // GPA CIRCLE ANIMATION
    // ============================================
    const gpaCircle = document.querySelector('.gpa-fill');
    if (gpaCircle) {
        const gpaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const gpa = parseFloat(gpaCircle.getAttribute('data-gpa'));
                    const circumference = 2 * Math.PI * 42;
                    const offset = circumference - (gpa / 4.0) * circumference;
                    gpaCircle.style.strokeDashoffset = offset;
                    gpaObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        gpaObserver.observe(gpaCircle.closest('.education-card'));
    }

    // ============================================
    // SKILLS TABS
    // ============================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.skill-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanels.forEach(panel => panel.classList.remove('active'));
            const targetPanel = document.getElementById(`tab-${tab}`);
            if (targetPanel) {
                targetPanel.classList.add('active');

                // Trigger skill fill animation
                targetPanel.querySelectorAll('.skill-fill').forEach(fill => {
                    fill.classList.remove('animated');
                    setTimeout(() => fill.classList.add('animated'), 50);
                });

                // Trigger reveal for cards
                targetPanel.querySelectorAll('.reveal').forEach((el, i) => {
                    el.classList.remove('visible');
                    setTimeout(() => el.classList.add('visible'), i * 100);
                });
            }
        });
    });

    // Initially animate first tab
    setTimeout(() => {
        const firstPanel = document.querySelector('.skill-panel.active');
        if (firstPanel) {
            firstPanel.querySelectorAll('.skill-fill').forEach(fill => {
                fill.classList.add('animated');
            });
        }
    }, 500);

    // ============================================
    // BACK TO TOP
    // ============================================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ============================================
    // RESP TAG RIPPLE EFFECT
    // ============================================
    document.querySelectorAll('.resp-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 100%; height: 100%;
                top: 0; left: 0;
                background: rgba(102, 126, 234, 0.2);
                border-radius: inherit;
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            from { transform: scale(0); opacity: 1; }
            to { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

});
