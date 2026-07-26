const fs = require('fs');
const path = require('path');
const { Usuario } = require('../models');

const baseDir = path.join(__dirname, '../uploads/fotos');

const uploadFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó imagen' });
    }

    const userId = req.usuario.id;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const fotoUrl = `/api/uploads/fotos/${userId}/perfil${ext}`;

    await Usuario.update({ foto: fotoUrl }, { where: { id: userId } });

    res.json({ foto: fotoUrl });
  } catch (error) {
    console.error('Error subiendo foto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getFotoPath = (userId) => {
  const userDir = path.join(baseDir, String(userId));
  if (!fs.existsSync(userDir)) return null;
  const files = fs.readdirSync(userDir);
  if (files.length === 0) return null;
  return path.join(userDir, files[0]);
};

module.exports = { uploadFoto, getFotoPath };
