const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const setupSwagger = require('./config/swagger');
const { authMiddleware } = require('./middleware/auth');
const upload = require('./middleware/upload');
const { uploadFoto } = require('./controllers/uploadController');

const authRoutes = require('./routes/auth');
const adminConductoresRoutes = require('./routes/adminConductores');
const adminVehiculosRoutes = require('./routes/adminVehiculos');
const adminReportesRoutes = require('./routes/adminReportes');
const conductorRoutes = require('./routes/conductor');
const profileRoutes = require('./routes/profile');
const publicRoutes = require('./routes/public');
const tiposServicioRoutes = require('./routes/tiposServicio');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

setupSwagger(app);

app.get('/', (req, res) => {
  res.json({ message: 'RuralGo API - Documentación: /api/docs' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/upload/foto', authMiddleware, upload.single('foto'), uploadFoto);

app.use('/api/auth', authRoutes);
app.use('/api/admin/conductores', adminConductoresRoutes);
app.use('/api/admin/vehiculos', adminVehiculosRoutes);
app.use('/api/admin', adminReportesRoutes);
app.use('/api/conductor', conductorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', publicRoutes);
app.use('/api/tipos-servicio', tiposServicioRoutes);

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');

    app.listen(PORT, () => {
      console.log(`Servidor: http://localhost:${PORT}`);
      console.log(`Swagger:  http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Error al iniciar:', error);
    process.exit(1);
  }
};

start();
