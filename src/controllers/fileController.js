const path = require('path');
const fs = require('fs');
const { DOWNLOADS_DIR } = require('../config/constants');
const { walkSync } = require('../utils/fileSystem');

exports.listSongs = (req, res) => {
    try {
        const rootDir = DOWNLOADS_DIR;
        const rawSongs = walkSync(rootDir);
        
        const songs = rawSongs.map(song => ({
            name: song.name,
            path: path.relative(rootDir, song.path),
            folder: song.folder
        }));
        
        res.json({ songs });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.serveFile = (req, res) => {
    // req.params[0] contains the wildcard part
    const filepath = req.params[0];
    
    if (!filepath) {
        return res.status(400).json({ error: "File path required" });
    }

    try {
        const decodedPath = decodeURIComponent(filepath);
        const fullPath = path.resolve(DOWNLOADS_DIR, decodedPath);

        // Security check to ensure we don't serve files outside root (basic)
        if (!fullPath.startsWith(DOWNLOADS_DIR)) {
            // In a real app, you might want more strict checks
            return res.status(403).json({ error: "Access denied" });
        }

        if (fs.existsSync(fullPath)) {
            res.download(fullPath); // Sets appropriate headers and streams file
        } else {
            res.status(404).json({ error: "File not found" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
