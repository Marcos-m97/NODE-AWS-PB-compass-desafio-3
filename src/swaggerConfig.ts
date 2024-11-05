import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Compass Car API',
      version: '1.0.0',
      description: 'API para um sistema de locação de carros.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Aplica autenticação JWT a todas as rotas
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos com anotação Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
