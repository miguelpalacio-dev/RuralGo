const { TipoServicio } = require('../models');

const getAll = async (req, res) => {
  try {
    const tipos = await TipoServicio.findAll();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { getAll };
