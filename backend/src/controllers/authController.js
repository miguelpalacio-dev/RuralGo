const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ message: 'Cuenta deshabilitada' });
    }

    if (rol && usuario.rol !== rol) {
      return res.status(403).json({ message: 'No tienes acceso a este módulo' });
    }

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
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
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, cedula, telefono, email, password, rol } = req.body;

    const exists = await Usuario.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const existsCedula = await Usuario.findOne({ where: { cedula } });
    if (existsCedula) {
      return res.status(400).json({ message: 'La cédula ya está registrada' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      nombre,
      cedula,
      telefono,
      email,
      password: hashedPassword,
      rol: rol || 'conductor',
      activo: true,
    });

    res.status(201).json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const me = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] },
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { login, register, me };
