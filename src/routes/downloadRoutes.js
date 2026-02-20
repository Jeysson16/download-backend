const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

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
router.post('/download', downloadController.downloadSpotify);

/**
 * @swagger
 * /download/youtube:
 *   post:
 *     summary: Download video or audio from YouTube
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
 *                 description: YouTube Video URL
 *                 example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *               format:
 *                 type: string
 *                 enum: [video, audio]
 *                 default: video
 *                 description: Download format (video=mp4, audio=mp3)
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
 *                     format:
 *                       type: string
 *                     output:
 *                       type: string
 *       400:
 *         description: Missing URL
 *       500:
 *         description: Server error or FFmpeg missing
 */
router.post('/download/youtube', downloadController.downloadYoutube);

module.exports = router;
