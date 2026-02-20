const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

/**
 * @swagger
 * /songs:
 *   get:
 *     summary: List all downloaded songs
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of songs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 songs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       path:
 *                         type: string
 *                       folder:
 *                         type: string
 */
router.get('/songs', fileController.listSongs);

/**
 * @swagger
 * /files/{filepath}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filepath
 *         required: true
 *         schema:
 *           type: string
 *         description: Relative path to the file (URL encoded)
 *     responses:
 *       200:
 *         description: File stream
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       403:
 *         description: Access denied
 */
router.get('/files/*', fileController.serveFile);

module.exports = router;
