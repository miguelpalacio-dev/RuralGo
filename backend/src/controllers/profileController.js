const bcrypt = require('bcryptjs');
const { Usuario, Conductor, Vehiculo } = require('../models');

const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] },
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const result = usuario.toJSON();

    if (usuario.rol === 'conductor') {
      const conductor = await Conductor.findOne({ where: { usuario_id: req.usuario.id } });
      if (conductor) {
        result.conductor = conductor;
        const vehiculos = await Vehiculo.findAll({ where: { conductor_id: conductor.id } });
        result.vehiculos = vehiculos;
      }
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (email && email !== usuario.email) {
      const exists = await Usuario.findOne({ where: { email } });
      if (exists) return res.status(400).json({ message: 'El email ya está en uso' });
    }

    await usuario.update({ nombre, telefono, email });

    const token = require('jsonwebtoken').sign(
      { id: usuario.id, email: email || usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Perfil actualizado',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        foto: usuario.foto,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { password_actual, password_nueva } = req.body;

    if (!password_actual || !password_nueva) {
      return res.status(400).json({ message: 'Ambas contraseñas son requeridas' });
    }

    const usuario = await Usuario.findByPk(req.usuario.id);
    const valid = await bcrypt.compare(password_actual, usuario.password);
    if (!valid) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
    }

    const hashed = await bcrypt.hash(password_nueva, 10);
    await usuario.update({ password: hashed });

    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
