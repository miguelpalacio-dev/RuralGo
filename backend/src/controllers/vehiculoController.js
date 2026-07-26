const { Vehiculo, Conductor, Usuario } = require('../models');

const getAll = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll({
      include: {
        model: Conductor,
        as: 'conductor',
        include: { model: Usuario, as: 'usuario', attributes: ['nombre', 'cedula'] },
      },
    });
    res.json(vehiculos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id, {
      include: {
        model: Conductor,
        as: 'conductor',
        include: { model: Usuario, as: 'usuario', attributes: ['nombre', 'cedula'] },
      },
    });
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const create = async (req, res) => {
  try {
    const { conductor_id, placa, marca, modelo, color, licencia_verificada, licencia_vencimiento, soat_verificado, soat_vencimiento } = req.body;

    const exists = await Vehiculo.findOne({ where: { placa } });
    if (exists) {
      return res.status(400).json({ message: 'La placa ya está registrada' });
    }

    const vehiculo = await Vehiculo.create({
      conductor_id,
      placa,
      marca,
      modelo,
      color,
      licencia_verificada: licencia_verificada || false,
      licencia_vencimiento,
      soat_verificado: soat_verificado || false,
      soat_vencimiento,
      activo: true,
    });

    res.status(201).json(vehiculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id);
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    const { placa, marca, modelo, color, licencia_verificada, licencia_vencimiento, soat_verificado, soat_vencimiento, activo } = req.body;

    if (placa && placa !== vehiculo.placa) {
      const exists = await Vehiculo.findOne({ where: { placa } });
      if (exists) return res.status(400).json({ message: 'La placa ya está en uso' });
    }

    await vehiculo.update({ placa, marca, modelo, color, licencia_verificada, licencia_vencimiento, soat_verificado, soat_vencimiento, activo });
    res.json({ message: 'Vehículo actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { getAll, getById, create, update };
