const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Conductor = require('./Conductor');

const Vehiculo = sequelize.define('vehiculo', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  conductor_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Conductor,
      key: 'id',
    },
  },
  placa: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  modelo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  licencia_verificada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  licencia_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  soat_verificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  soat_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'vehiculos',
});

Vehiculo.belongsTo(Conductor, { foreignKey: 'conductor_id', as: 'conductor' });
Conductor.hasMany(Vehiculo, { foreignKey: 'conductor_id', as: 'vehiculos' });

module.exports = Vehiculo;
