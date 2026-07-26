const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Conductor = sequelize.define('conductor', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'conductores',
});

Conductor.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasOne(Conductor, { foreignKey: 'usuario_id', as: 'conductor' });

module.exports = Conductor;
