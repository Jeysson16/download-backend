const { checkFfmpeg } = require('../utils/ffmpeg');

exports.getHealth = (req, res) => {
    res.json({ status: "ok", ffmpeg: checkFfmpeg() });
};

exports.getRoot = (req, res) => {
    res.send('<h1>Spotify & YouTube Downloader API</h1><p>Visit <a href="/api-docs">/api-docs</a> for documentation.</p>');
};
