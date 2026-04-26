/* =============================================
   KARAVALI ICE CREAMS — script.js
   Features:
   - Typing effect for hero subtitle
   - Sticky nav scroll behaviour
   - Mobile hamburger menu
   - Active nav link highlighting
   - Scroll reveal animations
   ============================================= */

(function () {
    'use strict';

    /* ---- DOM references ---- */
    const header      = document.getElementById('main-header');
    const hamburger   = document.getElementById('hamburger');
    const navLinks    = document.getElementById('nav-links');
    const typingEl    = document.getElementById('typing-text');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sections    = document.querySelectorAll('main section[id]');
    let lastScrollY   = window.scrollY;

    /* ================================================
       1. TYPING EFFECT
       ================================================ */
    const messages = [
        'Welcome to Karavali!',
        'Fresh. Creamy. Coastal.',
        'Made with Love & Fresh Milk.',
        'Your Favourite Since Day One.',
        'A Taste That Brings Joy.',
    ];

    let msgIndex   = 0;
    let charIndex  = 0;
    let isDeleting = false;
    let typingTimer;

    function type() {
        if (!typingEl) return;

        const currentMsg = messages[msgIndex];

        if (isDeleting) {
            typingEl.textContent = currentMsg.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = currentMsg.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 80;

        if (!isDeleting && charIndex === currentMsg.length) {
            // Pause at end of word
            delay = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            msgIndex = (msgIndex + 1) % messages.length;
            delay = 400;
        }

        typingTimer = setTimeout(type, delay);
    }

    // Start typing on load
    window.addEventListener('load', function () {
        setTimeout(type, 600);
    });


    /* ================================================
       2. STICKY NAV — scroll shadow
       ================================================ */
    function onScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (currentScrollY + 4 < lastScrollY && currentScrollY > 80) {
            document.body.classList.add('scrolling-up');
            header.classList.add('scrolling-up');
        } else {
            document.body.classList.remove('scrolling-up');
            header.classList.remove('scrolling-up');
        }

        lastScrollY = currentScrollY;
        highlightNavLink();
    }

    window.addEventListener('scroll', onScroll, { passive: true });


    /* ================================================
       3. HAMBURGER / MOBILE MENU
       ================================================ */
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on nav link click
        navLinks.querySelectorAll('a.nav-link').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (
                navLinks.classList.contains('open') &&
                !navLinks.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                closeMenu();
            }
        });
    }

    function closeMenu() {
        if (!navLinks || !hamburger) return;
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }


    /* ================================================
       4. ACTIVE NAV LINK — highlight current section
       ================================================ */
    function highlightNavLink() {
        let currentSection = '';
        const scrollY = window.scrollY + 100;

        sections.forEach(function (section) {
            const sectionTop    = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        allNavLinks.forEach(function (link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + currentSection || (currentSection === '' && href === '#top')) {
                link.classList.add('active');
            }
        });
    }


    /* ================================================
       5. SCROLL REVEAL ANIMATIONS
       ================================================ */
    // Elements to animate on scroll
    const revealTargets = [
        '.infra-card',
        '.branch-card',
        '.outlet-card',
        '.contact-card',
        '.highlight-card',
        '.section-title',
        '.section-desc',
        '.order-text',
        '.order-visual',
    ];

    const allRevealEls = document.querySelectorAll(revealTargets.join(', '));

    allRevealEls.forEach(function (el) {
        el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    allRevealEls.forEach(function (el) {
        revealObserver.observe(el);
    });


    /* ================================================
       6. STAGGERED CARD ANIMATIONS
       ================================================ */
    const cardGroups = [
        '.infra-grid .infra-card',
        '.branches-grid .branch-card',
        '.outlets-grid .outlet-card',
        '.contact-grid .contact-card',
    ];

    cardGroups.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (card, index) {
            card.style.transitionDelay = (index * 80) + 'ms';
        });
    });


    /* ================================================
       7. SMOOTH SCROLL POLYFILL for older iOS
       ================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '70');
                window.scrollTo({ top: top, behavior: 'smooth' });
                closeMenu();
            }
        });
    });


     /* ================================================
         8. CAREERS APPLY EMAIL TEMPLATE (GMAIL COMPOSE)
         ================================================ */
    const careerApplyBtn = document.getElementById('career-apply-btn');

     function buildCareerGmailComposeUrl(role) {
        const recipient = 'karavali7171@gmail.com';
        const safeRole = role || 'General Application';
        const subject = 'Career Application - ' + safeRole;
        const body = [
            'Hello Karavali Hiring Team,',
            '',
            'I would like to apply for the ' + safeRole + ' role.',
            '',
            'Applicant Details:',
            'Full Name: ',
            'Phone Number: ',
            'Current Location: ',
            'Highest Qualification: ',
            'Years of Experience: ',
            'Preferred Role: ' + safeRole,
            'Available to Join From: ',
            '',
            'Please attach resume as a PDF(optional).',
            '',
            'Thank you,',
            'Name',
        ].join('\n');

        return 'https://mail.google.com/mail/?view=cm&fs=1&tf=1'
            + '&to=' + encodeURIComponent(recipient)
            + '&su=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(body);
    }

    if (careerApplyBtn) {
        careerApplyBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const role = careerApplyBtn.getAttribute('data-role');
            window.open(buildCareerGmailComposeUrl(role), '_blank', 'noopener,noreferrer');
        });
    }

})();