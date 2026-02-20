const app = require('./src/app');

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Starting Node.js server on port ${PORT}...`);
    });
}

module.exports = app;
