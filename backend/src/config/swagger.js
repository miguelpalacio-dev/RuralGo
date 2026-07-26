const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RuralGo API',
      version: '1.0.0',
      description: 'API REST para plataforma de transporte RuralGo',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desarrollo local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            cedula: { type: 'string' },
            telefono: { type: 'string' },
            email: { type: 'string' },
            rol: { type: 'string', enum: ['admin', 'conductor'] },
            activo: { type: 'boolean' },
          },
        },
        Conductor: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            usuario_id: { type: 'integer' },
            disponible: { type: 'boolean' },
            usuario: { $ref: '#/components/schemas/Usuario' },
          },
        },
        Vehiculo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            conductor_id: { type: 'integer' },
            placa: { type: 'string' },
            marca: { type: 'string' },
            modelo: { type: 'string' },
            color: { type: 'string' },
            activo: { type: 'boolean' },
          },
        },
        Servicio: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            vehiculo_id: { type: 'integer' },
            tipo_servicio_id: { type: 'integer' },
            origen_nombre: { type: 'string' },
            destino_texto: { type: 'string' },
            precio: { type: 'number' },
            estado: { type: 'string', enum: ['en_curso', 'finalizado', 'cancelado'] },
            hora_inicio: { type: 'string', format: 'date-time' },
            hora_fin: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            rol: { type: 'string', enum: ['admin', 'conductor'] },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            usuario: { $ref: '#/components/schemas/Usuario' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'RuralGo API Docs',
  }));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
