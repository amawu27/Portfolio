// ===== MAIN APPLICATION =====
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ==================================================
    // PRESS START
    // ==================================================

    const overlay =
        document.getElementById('start-overlay');

    const startBtn =
        document.getElementById('start-btn');

    const playerLevel =
        document.getElementById('playerLevel');

    if (startBtn && overlay) {
        startBtn.addEventListener('click', () => {

            // Hide start screen
            overlay.classList.add('hidden');

            // Make absolutely sure it cannot block clicks
            overlay.style.pointerEvents = 'none';

            // Player One achievement
            if (window.AchievementSystem) {
                window.AchievementSystem.unlock(
                    '🎮 PLAYER ONE',
                    'Pressed Start.'
                );
            }

            if (playerLevel) {
                playerLevel.textContent = '01';
            }
        });
    }


    // ==================================================
    // THEME TOGGLE
    // ==================================================

    const themeToggle =
        document.getElementById('themeToggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {

            document.body.classList.toggle('light');

            const icon =
                themeToggle.querySelector('i');

            if (!icon) return;

            if (
                document.body.classList.contains('light')
            ) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }


    // ==================================================
    // NAVIGATION
    // ==================================================

    const navLinks =
        document.querySelectorAll('.nav-links a');

    const sections =
        document.querySelectorAll('section');

    const navLinksContainer =
        document.getElementById('navLinks');

    const hamburger =
        document.getElementById('hamburger');

    const lightBar =
        document.getElementById('lightBar');


    // ==================================================
    // COLOR MAP
    // ==================================================

    const barColors = {
        home: '#9e2b2b',
        about: '#b33a3a',
        skills: '#8a4b8a',
        education: '#2b6a8a',
        hobbies: '#3a8a4b',
        contact: '#b37a2b'
    };


    function updateLightBar(sectionId) {
        if (!lightBar) return;

        const color =
            barColors[sectionId] || '#9e2b2b';

        lightBar.style.background = color;

        lightBar.style.boxShadow =
            `0 0 20px ${color}66`;
    }


    function updatePlayerLevel(sectionId) {
        if (!playerLevel) return;

        const levelMap = {
            home: '01',
            about: '02',
            skills: '03',
            education: '04',
            hobbies: '05',
            contact: '06'
        };

        const level =
            levelMap[sectionId] || '01';

        playerLevel.textContent = level;
    }


    // ==================================================
    // HAMBURGER
    // ==================================================

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });
    }


    // ==================================================
    // NAVIGATION LINKS
    // ==================================================

    const visitedSections =
        new Set();

    navLinks.forEach(link => {

        link.addEventListener('click', (e) => {

            // Close mobile navigation
            if (navLinksContainer) {
                navLinksContainer.classList.remove('open');
            }

            // Active state
            navLinks.forEach(l => {
                l.classList.remove('active');
            });

            link.classList.add('active');

            // Get section ID
            const href =
                link.getAttribute('href');

            if (!href || !href.startsWith('#')) {
                return;
            }

            const sectionId =
                href.substring(1);

            updateLightBar(sectionId);
            updatePlayerLevel(sectionId);


            // ==========================================
            // MARK SECTION AS VISITED FIRST
            // ==========================================

            if (sectionId !== 'home') {
                link.classList.add('visited');
                visitedSections.add(sectionId);

                // Explorer achievement
                if (
                    visitedSections.size >= 2 &&
                    window.AchievementSystem
                ) {
                    window.AchievementSystem.unlock(
                        '🔍 EXPLORER',
                        'Visited multiple sections.'
                    );
                }
            }
        });
    });


    // ==================================================
    // LOGO -> HOME
    // ==================================================

    const navLogoBtn =
        document.getElementById('navLogoBtn');

    if (navLogoBtn) {
        navLogoBtn.addEventListener('click', () => {

            const home =
                document.getElementById('home');

            if (home) {
                home.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            navLinks.forEach(l => {
                l.classList.remove('active');
            });

            const homeLink =
                document.querySelector(
                    '.nav-links a[href="#home"]'
                );

            if (homeLink) {
                homeLink.classList.add('active');
            }

            updateLightBar('home');
            updatePlayerLevel('home');
        });
    }


    // ==================================================
    // INITIAL STATE
    // ==================================================

    updateLightBar('home');
    updatePlayerLevel('home');


    // ==================================================
    // SECTION OBSERVER
    // COMPLETIONIST ACHIEVEMENT
    // ==================================================

    const observerVisitedSections =
        new Set();

    if (
        'IntersectionObserver' in window &&
        sections.length > 0
    ) {
        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const id =
                            entry.target.id;

                        if (id) {

    navLinks.forEach(link => {
        link.classList.remove('active');

        if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
        }
    });

    updateLightBar(id);
    updatePlayerLevel(id);

    observerVisitedSections.add(id);
}

                        if (
                            observerVisitedSections.size >= 6 &&
                            window.AchievementSystem
                        ) {
                            window.AchievementSystem.unlock(
                                '⭐ COMPLETIONIST',
                                'Explored the entire website.'
                            );
                        }
                    });
                },
                {
                    threshold: 0.4
                }
            );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }


    // ==================================================
    // HOBBIES EXPAND
    // ==================================================

    const hobbyCards =
        document.querySelectorAll('.hobby-card');

    hobbyCards.forEach(card => {

        card.addEventListener('click', function () {
            this.classList.toggle('expanded');
        });
    });


    // ==================================================
    // INITIALIZE SUB-SYSTEMS
    // ==================================================

    // Achievement
    if (
        window.AchievementSystem &&
        typeof window.AchievementSystem.init === 'function'
    ) {
        window.AchievementSystem.init();
    }


    // Music
    if (
        window.MusicPlayer &&
        typeof window.MusicPlayer.init === 'function'
    ) {
        try {
            window.MusicPlayer.init();
        } catch (error) {
            // Prevent music errors from breaking the rest
        }
    }


    // Terminal
    if (
        window.TerminalSystem &&
        typeof window.TerminalSystem.init === 'function'
    ) {
        window.TerminalSystem.init();
    }


    // Easter Egg
    if (
        window.EasterEgg &&
        typeof window.EasterEgg.init === 'function'
    ) {
        try {
            window.EasterEgg.init();
        } catch (error) {
            // Prevent Easter Egg errors from breaking the rest
        }
    }
});