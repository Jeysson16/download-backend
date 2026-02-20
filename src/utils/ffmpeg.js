const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Helper function to check if FFmpeg is installed
 * @returns {boolean} True if FFmpeg is available
 */
function checkFfmpeg() {
    try {
        // Check if ffmpeg is in PATH
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        // Check spotdl specific location
        const home = os.homedir();
        const spotdlFfmpeg = path.join(home, '.spotdl', 'ffmpeg.exe');
        if (fs.existsSync(spotdlFfmpeg)) {
            return true;
        }
        return false;
    }
}

module.exports = {
    checkFfmpeg
};
