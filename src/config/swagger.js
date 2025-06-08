const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clean Architecture API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/interfaces/routes/*.js'], // Point to route files
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
