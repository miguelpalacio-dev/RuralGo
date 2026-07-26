const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vehiculo = require('./Vehiculo');
const TipoServicio = require('./TipoServicio');

const Servicio = sequelize.define('servicio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  vehiculo_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Vehiculo,
      key: 'id',
    },
  },
  tipo_servicio_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: TipoServicio,
      key: 'id',
    },
  },
  origen_nombre: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  origen_latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  origen_longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  destino_texto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'en_curso',
  },
  hora_inicio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  hora_fin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'servicios',
});

Servicio.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
Servicio.belongsTo(TipoServicio, { foreignKey: 'tipo_servicio_id', as: 'tipoServicio' });
Vehiculo.hasMany(Servicio, { foreignKey: 'vehiculo_id', as: 'servicios' });
TipoServicio.hasMany(Servicio, { foreignKey: 'tipo_servicio_id', as: 'servicios' });

module.exports = Servicio;
