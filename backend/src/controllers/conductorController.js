const { Conductor, Vehiculo, Ubicacion, Servicio, TipoServicio, Usuario } = require('../models');
const { Op } = require('sequelize');

const getMiConductor = async (req, res) => {
  try {
    const conductor = await Conductor.findOne({
      where: { usuario_id: req.usuario.id },
      include: [
        { model: Vehiculo, as: 'vehiculos' },
        { model: Ubicacion, as: 'ubicacion' },
      ],
    });

    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const vehiculoActivo = conductor.vehiculos.find((v) => v.activo) || null;

    res.json({
      id: conductor.id,
      disponible: conductor.disponible,
      vehiculoActivo,
      ubicacion: conductor.ubicacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const toggleDisponibilidad = async (req, res) => {
  try {
    const conductor = await Conductor.findOne({ where: { usuario_id: req.usuario.id } });
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    await conductor.update({ disponible: !conductor.disponible });
    res.json({ disponible: conductor.disponible });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const actualizarUbicacion = async (req, res) => {
  try {
    const { latitud, longitud, precision_metros } = req.body;
    const conductor = await Conductor.findOne({ where: { usuario_id: req.usuario.id } });

    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const [ubicacion, created] = await Ubicacion.findOrCreate({
      where: { conductor_id: conductor.id },
      defaults: {
        latitud,
        longitud,
        precision_metros,
        ultima_actualizacion: new Date(),
      },
    });

    if (!created) {
      await ubicacion.update({
        latitud,
        longitud,
        precision_metros,
        ultima_actualizacion: new Date(),
      });
    }

    res.json(ubicacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getMisVehiculos = async (req, res) => {
  try {
    const conductor = await Conductor.findOne({ where: { usuario_id: req.usuario.id } });
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const vehiculos = await Vehiculo.findAll({ where: { conductor_id: conductor.id } });
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const seleccionarVehiculo = async (req, res) => {
  try {
    const conductor = await Conductor.findOne({ where: { usuario_id: req.usuario.id } });
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    await Vehiculo.update({ activo: false }, { where: { conductor_id: conductor.id } });
    await Vehiculo.update({ activo: true }, { where: { id: req.params.id, conductor_id: conductor.id } });

    res.json({ message: 'Vehículo seleccionado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const crearServicio = async (req, res) => {
  try {
    const { tipo_servicio_id, destino_texto, precio } = req.body;

    const conductor = await Conductor.findOne({ where: { usuario_id: req.usuario.id } });
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const vehiculoActivo = await Vehiculo.findOne({
      where: { conductor_id: conductor.id, activo: true },
    });
    if (!vehiculoActivo) {
      return res.status(400).json({ message: 'No tienes un vehículo activo seleccionado' });
    }

    const servicioActivo = await Servicio.findOne({
      where: { vehiculo_id: vehiculoActivo.id, estado: 'en_curso' },
    });
    if (servicioActivo) {
      return res.status(400).json({ message: 'Ya tienes un servicio en curso' });
    }

    const ubicacion = await Ubicacion.findOne({ where: { conductor_id: conductor.id } });

    const servicio = await Servicio.create({
      vehiculo_id: vehiculoActivo.id,
      tipo_servicio_id,
      origen_nombre: ubicacion ? `Lat: ${ubicacion.latitud}, Lng: ${ubicacion.longitud}` : 'Sin ubicación',
      origen_latitud: ubicacion ? ubicacion.latitud : null,
      origen_longitud: ubicacion ? ubicacion.longitud : null,
      destino_texto,
      precio,
      estado: 'en_curso',
      hora_inicio: new Date(),
    });

    res.status(201).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const finalizarServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    await servicio.update({
      estado: 'finalizado',
      hora_fin: new Date(),
    });

    res.json({ message: 'Servicio finalizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const cancelarServicio = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    await servicio.update({
      estado: 'cancelado',
      hora_fin: new Date(),
    });

    res.json({ message: 'Servicio cancelado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getHistorial = async (req, res) => {
  try {
    const conductor = await Conductor.findOne({ where: { usuario_id: req.usuario.id } });
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const vehiculos = await Vehiculo.findAll({ where: { conductor_id: conductor.id } });
    const vehiculoIds = vehiculos.map((v) => v.id);

    const servicios = await Servicio.findAll({
      where: { vehiculo_id: { [Op.in]: vehiculoIds } },
      include: [
        { model: TipoServicio, as: 'tipoServicio' },
        { model: Vehiculo, as: 'vehiculo' },
      ],
      order: [['hora_inicio', 'DESC']],
    });

    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getMiConductor,
  toggleDisponibilidad,
  actualizarUbicacion,
  getMisVehiculos,
  seleccionarVehiculo,
  crearServicio,
  finalizarServicio,
  cancelarServicio,
  getHistorial,
};
