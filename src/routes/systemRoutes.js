const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Welcome message and link to documentation
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Welcome HTML
 */
router.get('/', systemController.getRoot);

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
router.get('/health', systemController.getHealth);

module.exports = router;
