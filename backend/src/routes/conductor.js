const express = require('express');
const router = express.Router();
const {
  getMiConductor,
  toggleDisponibilidad,
  actualizarUbicacion,
  getMisVehiculos,
  seleccionarVehiculo,
  crearServicio,
  finalizarServicio,
  cancelarServicio,
  getHistorial,
} = require('../controllers/conductorController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware, roleMiddleware('conductor'));

/**
 * @swagger
 * /api/conductor/mi-conductor:
 *   get:
 *     summary: Obtener datos del conductor autenticado
 *     tags: [Conductor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del conductor
 */
router.get('/mi-conductor', getMiConductor);

/**
 * @swagger
 * /api/conductor/disponibilidad:
 *   patch:
 *     summary: Toggle disponibilidad ON/OFF
 *     tags: [Conductor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada
 */
router.patch('/disponibilidad', toggleDisponibilidad);

/**
 * @swagger
 * /api/conductor/ubicacion:
 *   put:
 *     summary: Actualizar ubicación GPS
 *     tags: [Conductor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitud, longitud]
 *             properties:
 *               latitud:
 *                 type: number
 *               longitud:
 *                 type: number
 *               precision_metros:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ubicación actualizada
 */
router.put('/ubicacion', actualizarUbicacion);

/**
 * @swagger
 * /api/conductor/vehiculos:
 *   get:
 *     summary: Listar vehículos del conductor
 *     tags: [Conductor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos
 */
router.get('/vehiculos', getMisVehiculos);

/**
 * @swagger
 * /api/conductor/vehiculos/{id}/seleccionar:
 *   put:
 *     summary: Seleccionar vehículo activo
 *     tags: [Conductor]
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
 *         description: Vehículo seleccionado
 */
router.put('/vehiculos/:id/seleccionar', seleccionarVehiculo);

/**
 * @swagger
 * /api/conductor/servicios:
 *   post:
 *     summary: Registrar nuevo servicio
 *     tags: [Conductor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo_servicio_id, destino_texto, precio]
 *             properties:
 *               tipo_servicio_id:
 *                 type: integer
 *               destino_texto:
 *                 type: string
 *               precio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Servicio creado
 */
router.post('/servicios', crearServicio);

/**
 * @swagger
 * /api/conductor/servicios/{id}/finalizar:
 *   put:
 *     summary: Finalizar servicio
 *     tags: [Conductor]
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
 *         description: Servicio finalizado
 */
router.put('/servicios/:id/finalizar', finalizarServicio);

/**
 * @swagger
 * /api/conductor/servicios/{id}/cancelar:
 *   put:
 *     summary: Cancelar servicio
 *     tags: [Conductor]
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
 *         description: Servicio cancelado
 */
router.put('/servicios/:id/cancelar', cancelarServicio);

/**
 * @swagger
 * /api/conductor/historial:
 *   get:
 *     summary: Historial de servicios del conductor
 *     tags: [Conductor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
router.get('/historial', getHistorial);

module.exports = router;
