// ===== MAIN ENTRY POINT =====
// This file serves as the main entry point that initializes all systems.
// All functionality is now loaded through the individual JS files in the js/ folder.
// This file is kept for compatibility and to ensure everything loads correctly.

document.addEventListener('DOMContentLoaded', function() {
    // All systems are initialized in js/main.js
    // This file ensures the page is ready and all scripts are loaded.

    // Check if all systems are loaded
    const systems = ['AchievementSystem', 'MusicPlayer', 'TerminalSystem', 'EasterEgg'];
    systems.forEach(system => {
    if (window[system]) {
        console.log(`✅ ${system} loaded successfully.`);
    } else {
        console.warn(`⚠️ ${system} not found. Make sure all JS files are loaded.`);
    }
});
    


    // Additional initialization if needed
    console.log('🚀 Portfolio ready!');
});