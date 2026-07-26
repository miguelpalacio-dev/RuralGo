const { Conductor, Vehiculo, Ubicacion, Usuario } = require('../models');

const getDisponibles = async (req, res) => {
  try {
    const conductores = await Conductor.findAll({
      where: { disponible: true },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'telefono', 'foto'],
        },
        {
          model: Vehiculo,
          as: 'vehiculos',
          where: { activo: true },
          required: false,
        },
        {
          model: Ubicacion,
          as: 'ubicacion',
        },
      ],
    });

    const resultado = conductores
      .filter((c) => c.ubicacion)
      .map((c) => ({
        id: c.id,
        usuario: c.usuario,
        vehiculo: c.vehiculos[0] || null,
        ubicacion: {
          latitud: parseFloat(c.ubicacion.latitud),
          longitud: parseFloat(c.ubicacion.longitud),
        },
      }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { getDisponibles };
