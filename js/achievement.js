
// ===== ACHIEVEMENT SYSTEM =====
const AchievementSystem = {
    achievements: new Set(),

    toastElement: null,

    // Achievement queue
    queue: [],

    // Prevent multiple achievements from displaying at once
    isShowing: false,

    // Current timers
    toastTimeout: null,
    progressTimeout: null,

    initialized: false,

    init() {
        if (this.initialized) return;

        this.toastElement =
            document.getElementById('achieve-toast');

        if (!this.toastElement) {
            return;
        }

        this.initialized = true;

        // First achievement
        setTimeout(() => {
            this.unlock(
                '🏆 WELCOME',
                'Visited the portfolio.'
            );
        }, 1500);
    },


    // ==================================================
    // UNLOCK ACHIEVEMENT
    // ==================================================

    unlock(title, description) {
        const key = `${title}|${description}`;

        // Already unlocked
        if (this.achievements.has(key)) {
            return;
        }

        // Mark as unlocked immediately
        this.achievements.add(key);

        // Add achievement to queue
        this.queue.push({
            title,
            description
        });

        // If another achievement is currently showing,
        // wait until it finishes.
        if (!this.isShowing) {
            this.showNext();
        }
    },


    // ==================================================
    // SHOW NEXT ACHIEVEMENT
    // ==================================================

    showNext() {
        // Nothing left in queue
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        // Make sure toast exists
        if (!this.toastElement) {
            this.toastElement =
                document.getElementById('achieve-toast');
        }

        if (!this.toastElement) {
            this.queue = [];
            this.isShowing = false;
            return;
        }

        this.isShowing = true;

        // Get FIRST achievement in queue
        const achievement =
            this.queue.shift();

        const title =
            achievement.title;

        const description =
            achievement.description;


        // ==================================================
        // CLEAR OLD TIMERS
        // ==================================================

        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
            this.toastTimeout = null;
        }

        if (this.progressTimeout) {
            clearTimeout(this.progressTimeout);
            this.progressTimeout = null;
        }


        // ==================================================
        // BUILD TOAST
        // ==================================================

        this.toastElement.innerHTML = `
            <div class="achieve-toast-content">

                <div class="achieve-toast-icon">
                    🏆
                </div>

                <div class="achieve-toast-text">

                    <div class="achieve-toast-title">
                        ${title}
                    </div>

                    <div class="achieve-toast-desc">
                        ${description}
                    </div>

                </div>

            </div>

            <div class="achieve-toast-progress"></div>
        `;


        // ==================================================
        // RESTART ANIMATION
        // ==================================================

        this.toastElement.classList.remove('show');

        void this.toastElement.offsetWidth;

        this.toastElement.classList.add('show');


        // ==================================================
        // PROGRESS TIMER
        // ==================================================

        this.progressTimeout = setTimeout(() => {

            if (!this.toastElement) {
                return;
            }

            const progress =
                this.toastElement.querySelector(
                    '.achieve-toast-progress'
                );

            if (progress) {
                progress.style.animation = 'none';

                void progress.offsetWidth;

                progress.style.animation = '';
            }

        }, 3500);


        // ==================================================
        // HIDE CURRENT ACHIEVEMENT
        // ==================================================

        this.toastTimeout = setTimeout(() => {

            if (this.toastElement) {
                this.toastElement.classList.remove('show');
            }

            this.toastTimeout = null;

            // Give the hide animation a little time
            // before displaying the next achievement.
            setTimeout(() => {

                this.isShowing = false;

                // Show next queued achievement
                this.showNext();

            }, 350);

        }, 3500);
    },


    // ==================================================
    // CHECK ACHIEVEMENT
    // ==================================================

    hasAchievement(key) {
        return this.achievements.has(key);
    },


    // ==================================================
    // GET ALL ACHIEVEMENTS
    // ==================================================

    getAllAchievements() {
        return Array.from(this.achievements);
    }
};


// ==================================================
// GLOBAL ACCESS
// ==================================================

window.AchievementSystem = AchievementSystem;
