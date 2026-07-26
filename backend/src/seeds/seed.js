const sequelize = require('../config/database');
const { Usuario, Conductor, Vehiculo, Ubicacion, TipoServicio } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa');

    await sequelize.sync({ force: true });
    console.log('Tablas recreadas');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await Usuario.create({
      nombre: 'Administrador',
      cedula: '0000000000',
      telefono: '3000000000',
      email: 'admin@ruralgo.com',
      password: adminPassword,
      rol: 'admin',
      activo: true,
    });
    console.log('Admin creado:', admin.email);

    const conductorPassword = await bcrypt.hash('conductor123', 10);

    const juan = await Usuario.create({
      nombre: 'Juan Pérez',
      cedula: '1032456789',
      telefono: '3101234567',
      email: 'juan@ruralgo.com',
      password: conductorPassword,
      rol: 'conductor',
      activo: true,
    });

    const pedro = await Usuario.create({
      nombre: 'Pedro Gómez',
      cedula: '1098765432',
      telefono: '3159876543',
      email: 'pedro@ruralgo.com',
      password: conductorPassword,
      rol: 'conductor',
      activo: true,
    });

    const carlos = await Usuario.create({
      nombre: 'Carlos López',
      cedula: '1122334455',
      telefono: '3201122334',
      email: 'carlos@ruralgo.com',
      password: conductorPassword,
      rol: 'conductor',
      activo: true,
    });
    console.log('Conductores creados');

    const c1 = await Conductor.create({ usuario_id: juan.id, disponible: true });
    const c2 = await Conductor.create({ usuario_id: pedro.id, disponible: true });
    const c3 = await Conductor.create({ usuario_id: carlos.id, disponible: false });
    console.log('Registros de conductor creados');

    await Vehiculo.bulkCreate([
      { conductor_id: c1.id, placa: 'ABC123', marca: 'Yamaha', modelo: 'XTZ 150', color: 'Negro', activo: true, licencia_verificada: true, soat_verificado: true, licencia_vencimiento: '2027-12-31', soat_vencimiento: '2027-06-30' },
      { conductor_id: c1.id, placa: 'XYZ456', marca: 'Honda', modelo: 'CB160', color: 'Rojo', activo: false, licencia_verificada: true, soat_verificado: true, licencia_vencimiento: '2027-12-31', soat_vencimiento: '2027-06-30' },
      { conductor_id: c2.id, placa: 'KLM789', marca: 'Suzuki', modelo: 'AX100', color: 'Azul', activo: true, licencia_verificada: true, soat_verificado: true, licencia_vencimiento: '2027-12-31', soat_vencimiento: '2027-06-30' },
      { conductor_id: c3.id, placa: 'DEF321', marca: 'Bajaj', modelo: 'Pulsar 150', color: 'Blanco', activo: true, licencia_verificada: true, soat_verificado: true, licencia_vencimiento: '2027-12-31', soat_vencimiento: '2027-06-30' },
    ]);
    console.log('Vehículos creados');

    await Ubicacion.bulkCreate([
      { conductor_id: c1.id, latitud: 6.2442, longitud: -75.5812, precision_metros: 10, ultima_actualizacion: new Date() },
      { conductor_id: c2.id, latitud: 6.2520, longitud: -75.5700, precision_metros: 15, ultima_actualizacion: new Date() },
    ]);
    console.log('Ubicaciones creadas');

    await TipoServicio.bulkCreate([
      { nombre: 'Pasajero', descripcion: 'Transporte de personas' },
      { nombre: 'Encomienda', descripcion: 'Envío de paquetes' },
      { nombre: 'Diligencia', descripcion: 'Servicio de recados' },
      { nombre: 'Mixto', descripcion: 'Combinación de servicios' },
    ]);
    console.log('Tipos de servicio creados');

    console.log('\nSeed completado');
    console.log('Admin: admin@ruralgo.com / admin123');
    console.log('Conductor: juan@ruralgo.com / conductor123');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
};

seed();
