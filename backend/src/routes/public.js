const express = require('express');
const router = express.Router();
const { getDisponibles } = require('../controllers/publicController');

/**
 * @swagger
 * /api/conductores/disponibles:
 *   get:
 *     summary: Obtener conductores disponibles (público)
 *     tags: [Público]
 *     responses:
 *       200:
 *         description: Lista de conductores con ubicación
 */
router.get('/disponibles', getDisponibles);

module.exports = router;
