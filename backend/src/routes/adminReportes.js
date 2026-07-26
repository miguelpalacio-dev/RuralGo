const express = require('express');
const router = express.Router();
const { getStats, getServicios, getIngresos, getReporteConductores } = require('../controllers/reporteController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Estadísticas del dashboard
 *     tags: [Admin - Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generales
 */
router.get('/stats', authMiddleware, roleMiddleware('admin'), getStats);

/**
 * @swagger
 * /api/admin/reportes/servicios:
 *   get:
 *     summary: Consultar servicios con filtros
 *     tags: [Admin - Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: conductor_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: vehiculo_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tipo_servicio_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [en_curso, finalizado, cancelado]
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de servicios filtrados
 */
router.get('/reportes/servicios', authMiddleware, roleMiddleware('admin'), getServicios);

/**
 * @swagger
 * /api/admin/reportes/ingresos:
 *   get:
 *     summary: Consultar ingresos totales
 *     tags: [Admin - Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Total de ingresos y servicios
 */
router.get('/reportes/ingresos', authMiddleware, roleMiddleware('admin'), getIngresos);

/**
 * @swagger
 * /api/admin/reportes/conductores:
 *   get:
 *     summary: Reporte de servicios por conductor
 *     tags: [Admin - Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte por conductor
 */
router.get('/reportes/conductores', authMiddleware, roleMiddleware('admin'), getReporteConductores);

module.exports = router;
