const express = require('express');
const router = express.Router();
const { getAll, getById, create, update } = require('../controllers/vehiculoController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/admin/vehiculos:
 *   get:
 *     summary: Listar todos los vehículos
 *     tags: [Admin - Vehículos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos
 */
router.get('/', authMiddleware, roleMiddleware('admin'), getAll);

/**
 * @swagger
 * /api/admin/vehiculos/{id}:
 *   get:
 *     summary: Obtener vehículo por ID
 *     tags: [Admin - Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 */
router.get('/:id', authMiddleware, roleMiddleware('admin'), getById);

/**
 * @swagger
 * /api/admin/vehiculos:
 *   post:
 *     summary: Registrar nuevo vehículo
 *     tags: [Admin - Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conductor_id, placa, marca, modelo]
 *             properties:
 *               conductor_id:
 *                 type: integer
 *               placa:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               color:
 *                 type: string
 *               licencia_verificada:
 *                 type: boolean
 *               licencia_vencimiento:
 *                 type: string
 *                 format: date
 *               soat_verificado:
 *                 type: boolean
 *               soat_vencimiento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Vehículo creado
 */
router.post('/', authMiddleware, roleMiddleware('admin'), create);

/**
 * @swagger
 * /api/admin/vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehículo
 *     tags: [Admin - Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               color:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), update);

module.exports = router;
