const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil completo con conductor y vehículos
 */
router.get('/', authMiddleware, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Actualizar perfil (nombre, teléfono, email)
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.put('/', authMiddleware, updateProfile);

/**
 * @swagger
 * /api/profile/password:
 *   put:
 *     summary: Cambiar contraseña
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password_actual, password_nueva]
 *             properties:
 *               password_actual:
 *                 type: string
 *               password_nueva:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */
router.put('/password', authMiddleware, changePassword);

module.exports = router;
