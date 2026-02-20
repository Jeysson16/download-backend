const swaggerJsdoc = require('swagger-jsdoc');

const options = {
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
                url: 'https://download.jeysson.cloud',
                description: 'Production Server (Custom Domain)'
            },
            {
                url: '/',
                description: 'Current Server (Relative)'
            },
            {
                url: 'http://localhost:5000',
                description: 'Local Server'
            }
        ]
    },
    // Path to the API docs
    apis: ['./src/routes/*.js', './api.js'], 
};

const swaggerDocs = swaggerJsdoc(options);

module.exports = swaggerDocs;
