const express = require('express');
const cors = require('cors');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 5000;
const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Swagger Definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Spotify & YouTube Downloader API',
            version: '1.0.0',
            description: 'API for downloading music and videos from Spotify and YouTube using spotdl and yt-dlp.',
            contact: {
                name: 'API Support',
                url: 'https://github.com/Jeysson16/download-backend'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local server'
            },
            {
                url: 'https://your-vercel-app.vercel.app',
                description: 'Production server'
            }
        ]
    },
    apis: ['./api.js'], // Files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Helper function to check if FFmpeg is installed
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


// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health and FFmpeg status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 ffmpeg:
 *                   type: boolean
 *                   description: True if FFmpeg is installed/detected
 */
app.get('/health', (req, res) => {
    res.json({ status: "ok", ffmpeg: checkFfmpeg() });
});

// Download from Spotify
/**
 * @swagger
 * /download:
 *   post:
 *     summary: Download a track from Spotify
 *     tags: [Downloads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: Spotify Track URL
 *                 example: https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
 *     responses:
 *       200:
 *         description: Download successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     output:
 *                       type: string
 *       400:
 *         description: Missing URL
 *       500:
 *         description: Server error or FFmpeg missing
 */
app.post('/download', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    if (!checkFfmpeg()) {
        return res.status(500).json({ error: "FFmpeg not found. Please install it." });
    }

    console.log(`Starting download for URL: ${url}`);

    // Run spotdl
    // Using shell: true to ensure it finds the command on Windows
    const child = spawn('spotdl', [url], { 
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
        res.status(500).json({ error: err.message });
    });
});

// Download from YouTube
app.post('/download/youtube', (req, res) => {
    const { url, format } = req.body;
    const formatType = format || 'video'; // 'video' or 'audio'

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    if (!checkFfmpeg()) {
        return res.status(500).json({ error: "FFmpeg not found. Please install it." });
    }

    const commandArgs = [];
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
        res.status(500).json({ error: err.message });
    });
});

// Helper to walk directories recursively
function walkSync(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
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
    
    return fileList;
}

// List songs
app.get('/songs', (req, res) => {
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
});

// Serve files
app.get('/files/*', (req, res) => {
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
});

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Starting Node.js server on port ${PORT}...`);
    });
}

module.exports = app;
