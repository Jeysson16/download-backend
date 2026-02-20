const { spawn } = require('child_process');
const { DOWNLOADS_DIR } = require('../config/constants');
const { checkFfmpeg } = require('../utils/ffmpeg');

exports.downloadSpotify = (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const ffmpegPath = checkFfmpeg();
    if (!ffmpegPath) {
        return res.status(500).json({ error: "FFmpeg not found. Please install it." });
    }

    console.log(`Starting download for URL: ${url}`);

    // Run spotdl
    // Using shell: true to ensure it finds the command on Windows
    const child = spawn('spotdl', [url, '--ffmpeg', ffmpegPath], { 
        cwd: DOWNLOADS_DIR,
        shell: true 
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
            res.json({
                success: true,
                message: "Download completed successfully",
                data: {
                    url: url,
                    output: stdout
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Download failed",
                details: stderr || stdout
            });
        }
    });

    child.on('error', (err) => {
        console.error("Spawn error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: `Process failed to start: ${err.message}. Is the tool installed?` });
        }
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

    // Output template to current directory
    commandArgs.push('--output', '%(title)s.%(ext)s', url);

    console.log(`Starting YouTube download: ${url} (${formatType})`);

    const child = spawn('yt-dlp', commandArgs, { 
        cwd: DOWNLOADS_DIR,
        shell: true 
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
            res.json({
                success: true,
                message: "Download completed successfully",
                data: {
                    url: url,
                    format: formatType,
                    output: stdout
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Download failed",
                details: stderr || stdout
            });
        }
    });

    child.on('error', (err) => {
        console.error("Spawn error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: `Process failed to start: ${err.message}. Is the tool installed?` });
        }
    });
};
