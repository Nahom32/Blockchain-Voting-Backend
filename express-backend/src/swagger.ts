// swagger.ts

import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
  
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Your API Description',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your server URL
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/**/*.ts'], // Path to your API routes
};

const specs = swaggerJsdoc(options);

export default (app: express.Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
