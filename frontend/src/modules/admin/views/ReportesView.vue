<template>
  <AdminLayout titulo="Reportes">
    <div class="filters card">
      <div class="filter-row">
        <div class="form-group">
          <label>Tipo de reporte</label>
          <select v-model="tipoReporte">
            <option value="servicios">Servicios</option>
            <option value="ingresos">Ingresos</option>
            <option value="conductores">Por Conductor</option>
          </select>
        </div>
        <div class="form-group">
          <label>Fecha inicio</label>
          <input v-model="fechaInicio" type="date" />
        </div>
        <div class="form-group">
          <label>Fecha fin</label>
          <input v-model="fechaFin" type="date" />
        </div>
        <button @click="buscar" class="btn btn-primary">Buscar</button>
      </div>
    </div>

    <div v-if="tipoReporte === 'ingresos' && ingresos" class="card resumen-card">
      <h4>💰 Resumen de Ingresos</h4>
      <div class="resumen-grid">
        <div class="resumen-item">
          <span class="resumen-label">Total Ingresos</span>
          <span class="resumen-value">${{ ingresos.total_ingresos.toLocaleString() }}</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Total Servicios</span>
          <span class="resumen-value">{{ ingresos.total_servicios }}</span>
        </div>
        <div class="resumen-item" v-if="ingresos.total_servicios > 0">
          <span class="resumen-label">Promedio</span>
          <span class="resumen-value">${{ Math.round(ingresos.total_ingresos / ingresos.total_servicios).toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <div v-if="tipoReporte === 'conductores'" class="card chart-section">
      <h4 style="margin-bottom: 15px">📊 Servicios por Conductor</h4>
      <div class="bar-chart">
        <div v-for="r in reporteConductores" :key="r.conductor_id" class="bar-item">
          <div class="bar-label">{{ r.nombre }}</div>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: getBarWidth(r.total_servicios) + '%' }"></div>
          </div>
          <div class="bar-value">{{ r.total_servicios }}</div>
          <div class="bar-ingreso">${{ r.ingresos_totales.toLocaleString() }}</div>
        </div>
        <p v-if="reporteConductores.length === 0" class="empty-chart">Sin datos</p>
      </div>

      <div v-if="reporteConductores.length > 0" class="chart-legend" style="margin-top:20px">
        <table>
          <thead><tr><th>Nombre</th><th>Cédula</th><th>Total</th><th>Completados</th><th>Ingresos</th></tr></thead>
          <tbody>
            <tr v-for="r in reporteConductores" :key="r.conductor_id">
              <td>{{ r.nombre }}</td>
              <td>{{ r.cedula }}</td>
              <td>{{ r.total_servicios }}</td>
              <td>{{ r.servicios_completados }}</td>
              <td><strong>${{ r.ingresos_totales.toLocaleString() }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="tipoReporte === 'servicios'" class="table-responsive">
      <div class="card">
        <h4 style="margin-bottom: 15px">🚗 Servicios Registrados</h4>
        <table>
          <thead>
            <tr><th>Fecha</th><th>Conductor</th><th>Placa</th><th>Tipo</th><th>Origen</th><th>Destino</th><th>Precio</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in servicios" :key="s.id">
              <td>{{ formatDate(s.hora_inicio) }}</td>
              <td>{{ s.vehiculo?.conductor?.usuario?.nombre }}</td>
              <td>{{ s.vehiculo?.placa }}</td>
              <td>{{ s.tipoServicio?.nombre }}</td>
              <td>{{ s.origen_nombre }}</td>
              <td>{{ s.destino_texto }}</td>
              <td><strong>${{ s.precio }}</strong></td>
              <td>
                <span class="badge" :class="{
                  'badge-success': s.estado === 'finalizado',
                  'badge-danger': s.estado === 'cancelado',
                  'badge-warning': s.estado === 'en_curso',
                }">{{ s.estado }}</span>
              </td>
            </tr>
            <tr v-if="servicios.length === 0">
              <td colspan="8" class="empty-row">No hay servicios para los filtros seleccionados</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { useAdminStore } from '../../../stores/admin';

const adminStore = useAdminStore();
const tipoReporte = ref('servicios');
const fechaInicio = ref('');
const fechaFin = ref('');
const servicios = ref([]);
const ingresos = ref(null);
const reporteConductores = ref([]);

const formatDate = (d) => new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });

const getBarWidth = (total) => {
  const max = Math.max(...reporteConductores.value.map(c => c.total_servicios), 1);
  return (total / max) * 100;
};

const buscar = async () => {
  const params = {};
  if (fechaInicio.value) params.fecha_inicio = fechaInicio.value;
  if (fechaFin.value) params.fecha_fin = fechaFin.value;

  if (tipoReporte.value === 'servicios') {
    servicios.value = await adminStore.fetchReportes(params);
  } else if (tipoReporte.value === 'ingresos') {
    ingresos.value = await adminStore.fetchIngresos(params);
  } else {
    reporteConductores.value = await adminStore.fetchReporteConductores();
  }
};
</script>

<style scoped>
.filters { margin-bottom: 20px; }
.filter-row { display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap; }
.filter-row .form-group { flex: 1; min-width: 150px; }
.resumen-card h4 { margin-bottom: 15px; }
.resumen-grid { display: flex; gap: 40px; }
.resumen-item { display: flex; flex-direction: column; }
.resumen-label { font-size: 13px; color: #666; }
.resumen-value { font-size: 1.8rem; font-weight: 700; color: #2ecc71; }

.chart-section h4 { margin-bottom: 15px; }
.bar-chart { display: flex; flex-direction: column; gap: 12px; }
.bar-item { display: flex; align-items: center; gap: 10px; }
.bar-label { width: 120px; font-size: 13px; font-weight: 600; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-track { flex: 1; height: 24px; background: #ecf0f1; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, #2ecc71, #27ae60); border-radius: 4px; transition: width 0.5s; }
.bar-value { width: 30px; font-size: 13px; font-weight: 700; color: #2c3e50; }
.bar-ingreso { width: 80px; font-size: 12px; color: #666; text-align: right; }
.empty-chart { text-align: center; color: #95a5a6; padding: 20px; font-size: 14px; }

.chart-legend { overflow-x: auto; }
.chart-legend table { width: 100%; border-collapse: collapse; }
.chart-legend th, .chart-legend td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
.chart-legend th { background: #f8f9fa; font-weight: 600; }

.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
th { background: #f8f9fa; font-weight: 600; }
.empty-row { text-align: center; color: #95a5a6; padding: 30px !important; }

@media (max-width: 768px) {
  .resumen-grid { flex-direction: column; gap: 15px; }
  .bar-label { width: 80px; font-size: 11px; }
}
</style>
