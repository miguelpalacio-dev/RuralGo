const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, toggleActivo } = require('../controllers/conductorAdminController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/admin/conductores:
 *   get:
 *     summary: Listar todos los conductores
 *     tags: [Admin - Conductores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conductores
 */
router.get('/', authMiddleware, roleMiddleware('admin'), getAll);

/**
 * @swagger
 * /api/admin/conductores/{id}:
 *   get:
 *     summary: Obtener conductor por ID
 *     tags: [Admin - Conductores]
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
 *         description: Conductor encontrado
 *       404:
 *         description: Conductor no encontrado
 */
router.get('/:id', authMiddleware, roleMiddleware('admin'), getById);

/**
 * @swagger
 * /api/admin/conductores:
 *   post:
 *     summary: Registrar nuevo conductor
 *     tags: [Admin - Conductores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, cedula, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *               cedula:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Conductor creado
 */
router.post('/', authMiddleware, roleMiddleware('admin'), create);

/**
 * @swagger
 * /api/admin/conductores/{id}:
 *   put:
 *     summary: Actualizar conductor
 *     tags: [Admin - Conductores]
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
 *               nombre:
 *                 type: string
 *               cedula:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Conductor actualizado
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), update);

/**
 * @swagger
 * /api/admin/conductores/{id}/toggle:
 *   patch:
 *     summary: Activar/desactivar conductor
 *     tags: [Admin - Conductores]
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
 *         description: Estado actualizado
 */
router.patch('/:id/toggle', authMiddleware, roleMiddleware('admin'), toggleActivo);

module.exports = router;
