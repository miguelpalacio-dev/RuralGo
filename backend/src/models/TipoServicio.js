const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoServicio = sequelize.define('tipo_servicio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'tipos_servicio',
});

module.exports = TipoServicio;
