const express = require('express');
const { swaggerUi, specs } = require('./config/swagger');
const userRoutes = require('./interfaces/routes/userRoutes');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Mount routes
app.use('/api/users', userRoutes);

module.exports = app;
