// ===== ENHANCED EASTER EGG SYSTEM =====
const EasterEgg = {
    logoClickCount: 0,
    combo: [],
    secretTriggered: false,
    konamiIndex: 0,
    rickrollTriggered: false,
    achievementsUnlocked: new Set(),

    // Konami code sequence: ↑ ↑ ↓ ↓ ← → ← → B A
    konamiCode: ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'],
    
    // Secret click counter for hidden elements
    secretClicks: {
        footer: 0,
        skills: 0,
        avatar: 0
    },

    init() {
        // --- Existing Easter Eggs ---
        
        // Easter Egg 1: Click the logo 5 times
        const logoBtn = document.getElementById('navLogoBtn');
        if (logoBtn) {
            logoBtn.addEventListener('click', () => {
                this.logoClickCount++;
                if (this.logoClickCount === 5) {
                    this.triggerEasterEgg('SECRET', 'Easter egg found! (Logo clicks)');
                    this.logoClickCount = 0;
                }
            });
        }

        // Easter Egg 2: Keyboard combo "pol"
        document.addEventListener('keydown', (e) => {
            this.combo.push(e.key.toLowerCase());
            if (this.combo.length > 3) this.combo.shift();
            if (this.combo.join('') === 'pol') {
                this.triggerEasterEgg('EASTER EGG', 'Keyboard combo! (typed "pol")');
                this.combo = [];
            }
        });


        // Easter Egg 3: Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            const mappedKey = key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' 
                ? key 
                : key;
            
            if (mappedKey === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.triggerEasterEgg('🎮 KONAMI CODE', '↑ ↑ ↓ ↓ ← → ← → B A!');
                    this.konamiIndex = 0;
                    this.spawnConfetti();
                }
            } else {
                this.konamiIndex = 0;
            }
        });


        // Easter Egg 4: Rick Roll hidden in skills section (hover specific skill)
        const skillItems = document.querySelectorAll('.skill-item, .skill-tag');
        skillItems.forEach((skill, index) => {
            skill.addEventListener('dblclick', () => {
                if (!this.rickrollTriggered) {
                    this.rickrollTriggered = true;
                    this.triggerEasterEgg('🎵 RICK ROLL', 'Never gonna give you up!');
                    // Open Rick Roll in new tab after 1 second
                    setTimeout(() => {
                        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                    }, 1000);
                    setTimeout(() => { this.rickrollTriggered = false; }, 30000);
                }
            });
        });

        // Easter Egg 5: Secret word "developer" typed anywhere
        let secretWord = [];
        document.addEventListener('keydown', (e) => {
            secretWord.push(e.key.toLowerCase());
            if (secretWord.length > 9) secretWord.shift();
            if (secretWord.join('') === 'developer') {
                this.triggerEasterEgg('👨‍💻 DEVELOPER MODE', 'Typed "developer"!');
                secretWord = [];
                // Add a fun visual effect
                this.showDeveloperMode();
            }
        });

        // Easter Egg 6: Time-based achievement (visit at specific time)
        const now = new Date();
        if (now.getHours() === 0 || now.getHours() === 12) {
            setTimeout(() => {
                this.triggerEasterEgg('🕛 MIDNIGHT CODER', 'Visited at midnight/noon!');
            }, 3000);
        }

    },

    // Helper function to show floating text
    showFloatingText(text, element) {
        const float = document.createElement('div');
        float.textContent = text;
        float.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: bold;
            color: #9e2b2b;
            z-index: 10000;
            pointer-events: none;
            animation: floatUp 2s ease-out forwards;
            text-shadow: 0 0 20px rgba(158, 43, 43, 0.5);
        `;
        document.body.appendChild(float);
        setTimeout(() => float.remove(), 2000);
    },

    // Confetti effect for Konami code
    spawnConfetti() {
        const colors = ['#9e2b2b', '#b33a3a', '#8a4b8a', '#2b6a8a', '#3a8a4b', '#b37a2b', '#ff6b6b', '#ffd93d'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -10px;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                z-index: 9999;
                pointer-events: none;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    },


    // Developer mode activation
    showDeveloperMode() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation: developerGlow 2s ease-in-out infinite !important;
            }
            @keyframes developerGlow {
                0%, 100% { box-shadow: 0 0 0 transparent; }
                50% { box-shadow: 0 0 20px rgba(158, 43, 43, 0.3); }
            }
        `;
        document.head.appendChild(style);
        setTimeout(() => style.remove(), 3000);
    },

    triggerEasterEgg(title, description) {
        if (this.secretTriggered) return;
        this.secretTriggered = true;

        // Check if already unlocked this achievement
        const key = title + description;
        if (this.achievementsUnlocked.has(key)) {
            this.secretTriggered = false;
            return;
        }
        this.achievementsUnlocked.add(key);

        if (window.AchievementSystem) {
            window.AchievementSystem.unlock(title, description);
        }

        // Visual feedback - flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(158, 43, 43, 0.15);
            z-index: 9998;
            pointer-events: none;
            animation: flashAnim 0.6s ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 700);

        // Add animation style if not exists
        if (!document.getElementById('easter-egg-style')) {
            const style = document.createElement('style');
            style.id = 'easter-egg-style';
            style.textContent = `
                @keyframes flashAnim {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes floatUp {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -150%) scale(1.5); }
                }
                @keyframes confettiFall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                @keyframes terminalPulse {
                    0% { box-shadow: 0 0 50px rgba(0, 255, 65, 0.2); }
                    100% { box-shadow: 0 0 80px rgba(0, 255, 65, 0.5); }
                }
            `;
            document.head.appendChild(style);
        }

        // Reset after a few seconds so it can be triggered again
        setTimeout(() => {
            this.secretTriggered = false;
        }, 10000);
    },

    // Manual trigger for other easter eggs
    trigger(title, description) {
        this.triggerEasterEgg(title, description);
    }
};

window.EasterEgg = EasterEgg;