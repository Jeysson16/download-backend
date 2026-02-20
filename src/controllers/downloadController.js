const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { DOWNLOADS_DIR } = require('../config/constants');
const { checkFfmpeg } = require('../utils/ffmpeg');

// Helper to clean up directory
const cleanup = (dir) => {
    try {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    } catch (e) {
        console.error(`Error cleaning up ${dir}:`, e);
    }
};

exports.downloadSpotify = (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const ffmpegPath = checkFfmpeg();
    if (!ffmpegPath) {
        return res.status(500).json({ error: "FFmpeg not found. Please install it." });
    }

    // Create unique temp directory for this request
    const sessionId = `spotify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sessionDir = path.join(DOWNLOADS_DIR, sessionId);
    
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }

    console.log(`Starting download for URL: ${url} in ${sessionDir}`);

    // Run spotdl
    const child = spawn('spotdl', [url, '--ffmpeg', ffmpegPath, '--output', '{artist} - {title}.{ext}'], { 
        cwd: sessionDir,
        shell: false 
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    child.on('close', (code) => {
        if (code === 0) {
            // Find downloaded file
            try {
                const files = fs.readdirSync(sessionDir).filter(f => {
                    const ext = path.extname(f).toLowerCase();
                    return ['.mp3', '.m4a', '.wav', '.flac', '.ogg'].includes(ext);
                });

                if (files.length > 0) {
                    const filePath = path.join(sessionDir, files[0]);
                    const fileName = files[0];
                    
                    res.download(filePath, fileName, (err) => {
                        if (err) {
                            console.error("Error sending file:", err);
                            if (!res.headersSent) {
                                res.status(500).json({ error: "Error sending file" });
                            }
                        }
                        cleanup(sessionDir);
                    });
                } else {
                    res.status(500).json({ error: "No audio file found after download", details: stdout });
                    cleanup(sessionDir);
                }
            } catch (e) {
                console.error("Error finding file:", e);
                res.status(500).json({ error: "Internal server error processing download" });
                cleanup(sessionDir);
            }
        } else {
            res.status(500).json({
                success: false,
                error: "Download failed",
                details: stderr || stdout
            });
            cleanup(sessionDir);
        }
    });

    child.on('error', (err) => {
        console.error("Spawn error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: `Process failed to start: ${err.message}. Is the tool installed?` });
        }
        cleanup(sessionDir);
    });
};

exports.downloadYoutube = (req, res) => {
    const { url, format } = req.body;
    const formatType = format || 'video'; // 'video' or 'audio'

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const ffmpegPath = checkFfmpeg();
    if (!ffmpegPath) {
        return res.status(500).json({ error: "FFmpeg not found. Please install it." });
    }

    // Create unique temp directory for this request
    const sessionId = `yt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sessionDir = path.join(DOWNLOADS_DIR, sessionId);
    
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }

    const commandArgs = [];
    // Add ffmpeg location
    commandArgs.push('--ffmpeg-location', ffmpegPath);

    if (formatType === 'audio') {
        // Download audio only and convert to mp3
        commandArgs.push('-x', '--audio-format', 'mp3');
    } else {
        // Download best video+audio and merge to mp4
        commandArgs.push('--format', 'bestvideo+bestaudio/best', '--merge-output-format', 'mp4');
    }

    // Output template
    commandArgs.push('--output', '%(title)s.%(ext)s', url);

    console.log(`Starting YouTube download: ${url} (${formatType}) in ${sessionDir}`);

    const child = spawn('yt-dlp', commandArgs, { 
        cwd: sessionDir,
        shell: false 
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    child.on('close', (code) => {
        if (code === 0) {
             // Find downloaded file
             try {
                const files = fs.readdirSync(sessionDir).filter(f => {
                    const ext = path.extname(f).toLowerCase();
                    return ['.mp3', '.m4a', '.wav', '.flac', '.ogg', '.mp4', '.webm', '.mkv'].includes(ext);
                });

                if (files.length > 0) {
                    const filePath = path.join(sessionDir, files[0]);
                    const fileName = files[0];
                    
                    res.download(filePath, fileName, (err) => {
                        if (err) {
                            console.error("Error sending file:", err);
                            if (!res.headersSent) {
                                res.status(500).json({ error: "Error sending file" });
                            }
                        }
                        cleanup(sessionDir);
                    });
                } else {
                    res.status(500).json({ error: "No media file found after download", details: stdout });
                    cleanup(sessionDir);
                }
            } catch (e) {
                console.error("Error finding file:", e);
                res.status(500).json({ error: "Internal server error processing download" });
                cleanup(sessionDir);
            }
        } else {
            res.status(500).json({
                success: false,
                error: "Download failed",
                details: stderr || stdout
            });
            cleanup(sessionDir);
        }
    });

    child.on('error', (err) => {
        console.error("Spawn error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: `Process failed to start: ${err.message}. Is the tool installed?` });
        }
        cleanup(sessionDir);
    });
};
