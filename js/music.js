// ===== COMPLETE MUSIC PLAYER SYSTEM =====
const MusicPlayer = {
    currentTrack: null,
    currentArtist: null,
    currentDuration: 0,
    interval: null,
    playing: false,
    progress: 0,
    playlist: [],
    currentIndex: -1,
    audioElement: null, // The actual HTML <audio> element

    // DOM Elements
    miniPlayer: null,
    miniSong: null,
    miniArtist: null,
    miniPlayPause: null,
    miniStop: null,
    miniProgressFill: null,
    miniCurrentTime: null,
    miniTotalTime: null,
    nowPlayingTitle: null,
    nowPlayingArtist: null,
    currentTime: null,
    totalTime: null,
    currentlyPlaying: null,

    init() {
        // Get DOM elements
        this.miniPlayer = document.getElementById('mini-player');
        this.miniSong = document.getElementById('miniSong');
        this.miniArtist = document.getElementById('miniArtist');
        this.miniPlayPause = document.getElementById('miniPlayPause');
        this.miniStop = document.getElementById('miniStop');
        this.miniProgressFill = document.getElementById('miniProgressFill');
        this.miniCurrentTime = document.getElementById('miniCurrentTime');
        this.miniTotalTime = document.getElementById('miniTotalTime');
        this.nowPlayingTitle = document.getElementById('nowPlayingTitle');
        this.nowPlayingArtist = document.getElementById('nowPlayingArtist');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        this.currentlyPlaying = document.getElementById('currentlyPlaying');

        // Build playlist from track cards
        this.buildPlaylist();

        // Setup track play buttons
        document.querySelectorAll('.track-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const track = btn.dataset.track;
                const artist = btn.dataset.artist;
                const audioId = btn.dataset.audio;
                this.playTrack(track, artist, audioId);
            });
        });

        // Setup mini player controls
        this.miniPlayPause.addEventListener('click', () => this.togglePlayPause());
        this.miniStop.addEventListener('click', () => this.stopTrack());
        
        // Next/Prev buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.prevTrack());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextTrack());

        // Click on progress bar to seek
        document.querySelector('.mini-progress-bar').addEventListener('click', (e) => {
            if (!this.audioElement) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            this.audioElement.currentTime = x * this.audioElement.duration;
        });

        console.log('✅ Music Player System loaded.');
    },

    buildPlaylist() {
        this.playlist = [];
        document.querySelectorAll('.track-card').forEach(card => {
            const track = card.dataset.track;
            const artist = card.dataset.artist;
            const audioId = card.dataset.audio;
            if (track && artist && audioId) {
                this.playlist.push({ track, artist, audioId });
            }
        });
    },

    playTrack(track, artist, audioId) {
        // Find track in playlist
        const index = this.playlist.findIndex(t => t.track === track && t.artist === artist);
        if (index !== -1) this.currentIndex = index;

        // Stop current audio if playing
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.audioElement.removeEventListener('timeupdate', this.updateProgressHandler);
            this.audioElement.removeEventListener('ended', this.onTrackEndHandler);
        }

        // Get audio element
        this.audioElement = document.getElementById(audioId);
        if (!this.audioElement) {
            console.error(`Audio element "${audioId}" not found!`);
            return;
        }

        this.currentTrack = track;
        this.currentArtist = artist;
        this.progress = 0;

        // Update UI
        this.miniSong.textContent = track;
        this.miniArtist.textContent = artist;
        this.nowPlayingTitle.textContent = track;
        this.nowPlayingArtist.textContent = artist;

        // Show currently playing
        this.currentlyPlaying.style.display = 'block';
        this.miniPlayer.style.display = 'block';

        // Update play buttons
        document.querySelectorAll('.track-play-btn').forEach(btn => {
            btn.classList.remove('playing');
            const btnTrack = btn.dataset.track;
            const btnArtist = btn.dataset.artist;
            if (btnTrack === track && btnArtist === artist) {
                btn.classList.add('playing');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Playing...';
            } else {
                btn.innerHTML = `<i class="fas fa-play"></i> Play Track`;
            }
        });

        // Setup audio event listeners
        this.updateProgressHandler = () => {
            if (this.audioElement.duration) {
                const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
                this.miniProgressFill.style.width = progress + '%';
                this.miniCurrentTime.textContent = this.formatTime(this.audioElement.currentTime);
                this.currentTime.textContent = this.formatTime(this.audioElement.currentTime);
                this.totalTime.textContent = this.formatTime(this.audioElement.duration);
                this.miniTotalTime.textContent = this.formatTime(this.audioElement.duration);
            }
        };

        this.onTrackEndHandler = () => {
            this.nextTrack();
        };

        this.audioElement.addEventListener('timeupdate', this.updateProgressHandler);
        this.audioElement.addEventListener('ended', this.onTrackEndHandler);

        // Load metadata to get duration
        this.audioElement.load();

       this.audioElement.play()
    .then(() => {
        this.playing = true;
        this.miniPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
        console.log('▶️ Playing:', track);
    })
    .catch(err => {
        console.warn('Playback error:', err);
        this.playing = false;
        this.miniPlayPause.innerHTML = '<i class="fas fa-play"></i>';
    });

        // Unlock achievement
        if (window.AchievementSystem) {
            window.AchievementSystem.unlock('🎵 MUSIC LOVER', 'Started playing a song.');
        }
    },

    togglePlayPause() {
    if (!this.audioElement || !this.currentTrack) {
        console.warn('No audio element or track selected');
        return;
    }

    if (this.audioElement.paused) {
        // Currently paused - play
        this.audioElement.play()
            .then(() => {
                this.playing = true;
                this.miniPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
                console.log('▶️ Playing');
            })
            .catch(err => {
                console.warn('Playback error:', err);
                this.playing = false;
                this.miniPlayPause.innerHTML = '<i class="fas fa-play"></i>';
            });
    } else {
        // Currently playing - pause
        this.audioElement.pause();
        this.playing = false;
        this.miniPlayPause.innerHTML = '<i class="fas fa-play"></i>';
        console.log('⏸️ Paused');
    }
},

    stopTrack() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.audioElement.removeEventListener('timeupdate', this.updateProgressHandler);
            this.audioElement.removeEventListener('ended', this.onTrackEndHandler);
        }
        
        this.miniPlayer.style.display = 'none';
        this.currentlyPlaying.style.display = 'none';
        this.playing = false;
        this.progress = 0;
        this.currentTrack = null;
        this.miniProgressFill.style.width = '0%';
        this.miniPlayPause.innerHTML = '<i class="fas fa-play"></i>';
        this.miniCurrentTime.textContent = '00:00';
        this.currentTime.textContent = '00:00';
        
        // Reset all play buttons
        document.querySelectorAll('.track-play-btn').forEach(btn => {
            btn.classList.remove('playing');
            btn.innerHTML = `<i class="fas fa-play"></i> Play Track`;
        });
    },

    nextTrack() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        const track = this.playlist[this.currentIndex];
        this.playTrack(track.track, track.artist, track.audioId);
    },

    prevTrack() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        const track = this.playlist[this.currentIndex];
        this.playTrack(track.track, track.artist, track.audioId);
    },

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
};


// Expose to window for other scripts
window.MusicPlayer = MusicPlayer;