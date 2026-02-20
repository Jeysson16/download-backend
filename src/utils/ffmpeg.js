const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ffmpegStatic = require('ffmpeg-static');

/**
 * Helper function to check if FFmpeg is installed
 * @returns {string|null} Path to FFmpeg executable or null if not found
 */
function checkFfmpeg() {
    // 1. Check if ffmpeg-static provides a valid path
    if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
        return ffmpegStatic;
    }

    try {
        // 2. Check if ffmpeg is in PATH
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return 'ffmpeg';
    } catch (e) {
        // 3. Check spotdl specific location
        const home = os.homedir();
        const executable = os.platform() === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
        const spotdlFfmpeg = path.join(home, '.spotdl', executable);
        if (fs.existsSync(spotdlFfmpeg)) {
            return spotdlFfmpeg;
        }
        return null;
    }
}

module.exports = {
    checkFfmpeg
};
