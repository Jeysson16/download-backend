const fs = require('fs');
const path = require('path');

/**
 * Helper to walk directories recursively
 * @param {string} dir Directory to walk
 * @param {Array} fileList List of files accumulated
 * @returns {Array} List of file objects
 */
function walkSync(dir, fileList = []) {
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach((file) => {
            const filePath = path.join(dir, file);
            let stat;
            try {
                stat = fs.statSync(filePath);
            } catch (e) {
                return; // Skip if cannot stat
            }
            
            if (stat.isDirectory()) {
                // Skip specific directories
                if (file === '.git' || file === 'mtouch_music' || file === 'node_modules' || file === '.trae') {
                    return;
                }
                walkSync(filePath, fileList);
            } else {
                if (file.toLowerCase().endsWith('.mp3') || file.toLowerCase().endsWith('.mp4')) {
                    fileList.push({
                        name: file,
                        path: filePath, // Full path temporarily
                        folder: path.basename(dir)
                    });
                }
            }
        });
    } catch (e) {
        console.error(`Error walking directory ${dir}:`, e);
    }
    
    return fileList;
}

module.exports = {
    walkSync
};
