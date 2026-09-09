// ===== TERMINAL SYSTEM - CHAT STYLE =====
const TerminalSystem = {
    terminal: null,
    input: null,
    output: null,
    toggleBtn: null,
    closeBtn: null,

    isOpen: false,
    commandHistory: [],
    historyIndex: -1,
    initialized: false,

    init() {
        if (this.initialized) return;

        // Get terminal elements
        this.terminal = document.getElementById('mini-terminal');
        this.input = document.getElementById('termInput');
        this.output = document.getElementById('term-output');
        this.toggleBtn = document.getElementById('terminal-toggle');
        this.closeBtn = document.getElementById('termClose');

        // Make sure all required elements exist
        if (
            !this.terminal ||
            !this.input ||
            !this.output ||
            !this.toggleBtn ||
            !this.closeBtn
        ) {
            return;
        }

        this.initialized = true;

        // ---------- TERMINAL TOGGLE ----------
        this.toggleBtn.addEventListener('click', () => {
            this.toggle();
        });

        // ---------- TERMINAL CLOSE ----------
        this.closeBtn.addEventListener('click', () => {
            this.close();
        });

        // ---------- TERMINAL INPUT ----------
        this.input.addEventListener('keydown', (e) => {
            // Enter = execute command
            if (e.key === 'Enter') {
                const cmd = this.input.value.trim();

                if (!cmd) {
                    return;
                }

                this.handleCommand(cmd);

                this.commandHistory.push(cmd);
                this.historyIndex = this.commandHistory.length;

                this.input.value = '';
            }

            // Arrow Up = previous command
            if (e.key === 'ArrowUp') {
                e.preventDefault();

                if (this.historyIndex > 0) {
                    this.historyIndex--;

                    this.input.value =
                        this.commandHistory[this.historyIndex];
                }
            }

            // Arrow Down = next command
            if (e.key === 'ArrowDown') {
                e.preventDefault();

                if (
                    this.historyIndex <
                    this.commandHistory.length - 1
                ) {
                    this.historyIndex++;

                    this.input.value =
                        this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex =
                        this.commandHistory.length;

                    this.input.value = '';
                }
            }
        });
    },

    // ---------- OPEN / CLOSE ----------
    toggle() {
        if (!this.terminal) return;

        this.isOpen = !this.isOpen;

        this.terminal.classList.toggle(
            'active',
            this.isOpen
        );

        if (this.isOpen) {
            if (this.input) {
                setTimeout(() => {
                    this.input.focus();
                }, 50);
            }

            this.addMessage(
                'system',
                '🖥️',
                'Terminal ready. Type "help" for commands.'
            );
        }
    },

    close() {
        if (!this.terminal) return;

        this.isOpen = false;

        this.terminal.classList.remove('active');
    },

    // ---------- ADD MESSAGE ----------
    addMessage(type, icon, text) {
        if (!this.output) return;

        const msgDiv = document.createElement('div');

        msgDiv.className = `chat-message ${type}`;

        msgDiv.innerHTML = `
            <span class="msg-icon">${icon}</span>
            <span class="msg-text">${text}</span>
        `;

        this.output.appendChild(msgDiv);

        this.output.scrollTop =
            this.output.scrollHeight;
    },

    // ---------- HANDLE COMMAND ----------
    handleCommand(cmd) {
        if (!cmd) return;

        // Add user message
        this.addMessage(
            'user',
            '👤',
            this.escapeHtml(cmd)
        );

        let response = '';
        let icon = '🤖';

        switch (cmd.toLowerCase()) {

            case 'help':
                response =
                    '<b>Available Commands:</b><br>' +
                    'about, skills, education, hobbies, ' +
                    'contact, clear, theme, whoami, date, credits';

                icon = '💡';
                break;

            case 'about':
                response =
                    'CS student at <b>Philippine Christian University</b>. ' +
                    'Learning web development. ' +
                    'Passionate about building things.';

                icon = '👨‍💻';
                break;

            case 'skills':
                response =
                    '<b>Skills:</b><br>' +
                    '• HTML (Level 3)<br>' +
                    '• CSS (Level 2)<br>' +
                    '• JavaScript (Level 2)<br>' +
                    '• Java (Level 5)<br>' +
                    '• Git/GitHub (Level 1)<br>' +
                    '• C++ (Level 2)';

                icon = '⚡';
                break;

            case 'education':
                response =
                    '<b>BSCS</b> @ Philippine Christian University ' +
                    '(2022-2026)<br>' +
                    'Building foundations in systems, algorithms, ' +
                    'and modular design.';

                icon = '📚';
                break;

            case 'hobbies':
                response =
                    '🎮 Gaming<br>' +
                    '🎵 Listening to Music<br>' +
                    '🎬 Watching Anime<br>' +
                    '💻 Exploring Technology';

                icon = '🎯';
                break;

            case 'contact':
                response =
                    'Email: christianpauldiaz27@gmail.com<br>' +
                    'GitHub: github.com/amawu27<br>';

                icon = '📫';
                break;

            case 'clear':
                if (this.output) {
                    this.output.innerHTML = '';
                }

                return;

            case 'theme':
                document.body.classList.toggle('light');

                const iconEl =
                    document.querySelector(
                        '.theme-toggle i'
                    );

                if (
                    document.body.classList.contains('light')
                ) {
                    if (iconEl) {
                        iconEl.className = 'fas fa-sun';
                    }

                    response =
                        '☀️ Theme switched to <b>Light</b> mode.';
                } else {
                    if (iconEl) {
                        iconEl.className = 'fas fa-moon';
                    }

                    response =
                        '🌙 Theme switched to <b>Dark</b> mode.';
                }

                icon = '🎨';
                break;

            case 'whoami':
                response =
                    'I\'m <b>Christian Paul Diaz</b><br>' +
                    'Computer Science student | ' +
                    'Aspiring Full-Stack Developer';

                icon = '🆔';
                break;

            case 'date':
                response =
                    new Date().toLocaleString();

                icon = '📅';
                break;

            case 'credits':
                response =
                    'Powered by <b>Christian Paul Diaz</b> · Portfolio<br>' +
                    '<b>Inspired by Thea</b>';

                icon = '✨';
                break;

            default:
                response =
                    `Unknown command: "<b>${this.escapeHtml(cmd)}</b>"<br>` +
                    'Type "help" for available commands.';

                icon = '⚠️';
                break;
        }

        // Chat-style response delay
        setTimeout(() => {
            this.addMessage(
                'response',
                icon,
                response
            );
        }, 200);

        // Terminal achievement
        const achievementCommands = [
            'about',
            'skills',
            'education',
            'hobbies',
            'contact',
            'help',
            'theme',
            'whoami'
        ];

        if (
            achievementCommands.includes(
                cmd.toLowerCase()
            )
        ) {
            if (window.AchievementSystem) {
                window.AchievementSystem.unlock(
                    '💻 TERMINAL USER',
                    'Used the terminal successfully.'
                );
            }
        }
    },

    // ---------- ESCAPE HTML ----------
    escapeHtml(text) {
        const div = document.createElement('div');

        div.textContent = text;

        return div.innerHTML;
    }
};

// Make globally accessible
window.TerminalSystem = TerminalSystem;