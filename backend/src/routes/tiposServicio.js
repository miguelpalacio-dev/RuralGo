const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/tipoServicioController');

/**
 * @swagger
 * /api/tipos-servicio:
 *   get:
 *     summary: Listar tipos de servicio
 *     tags: [Público]
 *     responses:
 *       200:
 *         description: Lista de tipos de servicio
 */
router.get('/', getAll);

module.exports = router;
