const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

// Routes
const systemRoutes = require('./routes/systemRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css',
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js'
    ]
}));

// Use Routes
app.use('/', systemRoutes);
app.use('/', downloadRoutes);
app.use('/', fileRoutes);

module.exports = app;
