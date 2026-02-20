const path = require('path');
const os = require('os');
const fs = require('fs');

// Determine downloads directory based on environment
// Vercel only allows writing to /tmp
const isVercel = process.env.VERCEL === '1';
const DOWNLOADS_DIR = isVercel ? path.join(os.tmpdir(), 'downloads') : path.join(process.cwd(), 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
    try {
        fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
    } catch (e) {
        console.error("Error creating downloads directory:", e);
        // Fallback to tmp if explicit creation fails
        if (!isVercel) {
             console.log("Falling back to os.tmpdir()");
        }
    }
}

module.exports = {
    DOWNLOADS_DIR,
    isVercel
};
