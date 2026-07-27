const { Servicio, Conductor, Vehiculo, Usuario, TipoServicio, Ubicacion, sequelize } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const getStats = async (req, res) => {
  try {
    const totalConductores = await Conductor.count();
    const totalDisponibles = await Conductor.count({ where: { disponible: true } });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const serviciosHoy = await Servicio.count({
      where: { hora_inicio: { [Op.gte]: hoy } },
    });

    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const serviciosMes = await Servicio.count({
      where: { hora_inicio: { [Op.gte]: primerDiaMes } },
    });

    res.json({
      conductores: totalConductores,
      disponibles: totalDisponibles,
      serviciosHoy,
      serviciosMes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getServicios = async (req, res) => {
  try {
    const { conductor_id, vehiculo_id, tipo_servicio_id, estado, fecha_inicio, fecha_fin } = req.query;

    const where = {};
    if (conductor_id) {
      const vehiculos = await Vehiculo.findAll({ where: { conductor_id } });
      where.vehiculo_id = { [Op.in]: vehiculos.map((v) => v.id) };
    }
    if (vehiculo_id) where.vehiculo_id = vehiculo_id;
    if (tipo_servicio_id) where.tipo_servicio_id = tipo_servicio_id;
    if (estado) where.estado = estado;
    if (fecha_inicio || fecha_fin) {
      where.hora_inicio = {};
      if (fecha_inicio) where.hora_inicio[Op.gte] = new Date(fecha_inicio);
      if (fecha_fin) {
        const end = new Date(fecha_fin);
        end.setDate(end.getDate() + 1);
        where.hora_inicio[Op.lt] = end;
      }
    }

    const servicios = await Servicio.findAll({
      where,
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
          include: {
            model: Conductor,
            as: 'conductor',
            include: { model: Usuario, as: 'usuario', attributes: ['nombre', 'cedula'] },
          },
        },
        { model: TipoServicio, as: 'tipoServicio' },
      ],
      order: [['hora_inicio', 'DESC']],
    });

    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getIngresos = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const where = { estado: 'finalizado' };
    if (fecha_inicio || fecha_fin) {
      where.hora_inicio = {};
      if (fecha_inicio) where.hora_inicio[Op.gte] = new Date(fecha_inicio);
      if (fecha_fin) {
        const end = new Date(fecha_fin);
        end.setDate(end.getDate() + 1);
        where.hora_inicio[Op.lt] = end;
      }
    }

    const resultado = await Servicio.findOne({
      where,
      attributes: [
        [fn('SUM', col('precio')), 'total_ingresos'],
        [fn('COUNT', col('servicio.id')), 'total_servicios'],
      ],
      raw: true,
    });

    res.json({
      total_ingresos: parseFloat(resultado.total_ingresos) || 0,
      total_servicios: parseInt(resultado.total_servicios) || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getReporteConductores = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const servicioWhere = {};
    if (fecha_inicio || fecha_fin) {
      servicioWhere.hora_inicio = {};
      if (fecha_inicio) servicioWhere.hora_inicio[Op.gte] = new Date(fecha_inicio);
      if (fecha_fin) {
        const end = new Date(fecha_fin);
        end.setDate(end.getDate() + 1);
        servicioWhere.hora_inicio[Op.lt] = end;
      }
    }

    const conductores = await Conductor.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'cedula'],
        },
        {
          model: Vehiculo,
          as: 'vehiculos',
          include: {
            model: Servicio,
            as: 'servicios',
            where: Object.keys(servicioWhere).length > 0 ? servicioWhere : undefined,
            attributes: ['id', 'precio', 'estado', 'hora_inicio'],
          },
        },
      ],
    });

    const reporte = conductores.map((c) => {
      const servicios = c.vehiculos.flatMap((v) => v.servicios);
      const completados = servicios.filter((s) => s.estado === 'finalizado');
      return {
        conductor_id: c.id,
        nombre: c.usuario.nombre,
        cedula: c.usuario.cedula,
        total_servicios: servicios.length,
        servicios_completados: completados.length,
        ingresos_totales: completados.reduce((sum, s) => sum + parseFloat(s.precio || 0), 0),
      };
    });

    res.json(reporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { getStats, getServicios, getIngresos, getReporteConductores };
