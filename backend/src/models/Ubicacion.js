const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Conductor = require('./Conductor');

const Ubicacion = sequelize.define('ubicacion', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  conductor_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    references: {
      model: Conductor,
      key: 'id',
    },
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  precision_metros: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  ultima_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'ubicaciones',
});

Ubicacion.belongsTo(Conductor, { foreignKey: 'conductor_id', as: 'conductor' });
Conductor.hasOne(Ubicacion, { foreignKey: 'conductor_id', as: 'ubicacion' });

module.exports = Ubicacion;
