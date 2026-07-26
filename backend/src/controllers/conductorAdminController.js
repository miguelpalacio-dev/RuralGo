const { Usuario, Conductor, Vehiculo, Ubicacion } = require('../models');

const getAll = async (req, res) => {
  try {
    const conductores = await Conductor.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
        { model: Vehiculo, as: 'vehiculos' },
        { model: Ubicacion, as: 'ubicacion' },
      ],
    });
    res.json(conductores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const conductor = await Conductor.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
        { model: Vehiculo, as: 'vehiculos' },
        { model: Ubicacion, as: 'ubicacion' },
      ],
    });
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }
    res.json(conductor);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, cedula, telefono, email, password } = req.body;

    const existsEmail = await Usuario.findOne({ where: { email } });
    if (existsEmail) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const existsCedula = await Usuario.findOne({ where: { cedula } });
    if (existsCedula) {
      return res.status(400).json({ message: 'La cédula ya está registrada' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      cedula,
      telefono,
      email,
      password: hashedPassword,
      rol: 'conductor',
      activo: true,
    });

    const conductor = await Conductor.create({
      usuario_id: usuario.id,
      disponible: false,
    });

    res.status(201).json({
      id: conductor.id,
      usuario_id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const conductor = await Conductor.findByPk(req.params.id);
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const usuario = await Usuario.findByPk(conductor.usuario_id);
    const { nombre, cedula, telefono, email, activo } = req.body;

    if (email && email !== usuario.email) {
      const exists = await Usuario.findOne({ where: { email } });
      if (exists) return res.status(400).json({ message: 'El email ya está en uso' });
    }

    await usuario.update({ nombre, cedula, telefono, email, activo });
    res.json({ message: 'Conductor actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const toggleActivo = async (req, res) => {
  try {
    const conductor = await Conductor.findByPk(req.params.id);
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const usuario = await Usuario.findByPk(conductor.usuario_id);
    await usuario.update({ activo: !usuario.activo });

    res.json({ message: 'Estado actualizado', activo: usuario.activo });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { getAll, getById, create, update, toggleActivo };
