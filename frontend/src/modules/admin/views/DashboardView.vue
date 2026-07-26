<template>
  <AdminLayout titulo="Dashboard">
    <div class="stats">
      <div class="card stat">
        <div class="stat-icon">👥</div>
        <h3>{{ stats.conductores }}</h3>
        <p>Conductores</p>
      </div>
      <div class="card stat">
        <div class="stat-icon">🟢</div>
        <h3>{{ stats.disponibles }}</h3>
        <p>Disponibles</p>
      </div>
      <div class="card stat">
        <div class="stat-icon">🚗</div>
        <h3>{{ stats.serviciosHoy }}</h3>
        <p>Servicios Hoy</p>
      </div>
      <div class="card stat">
        <div class="stat-icon">📅</div>
        <h3>{{ stats.serviciosMes }}</h3>
        <p>Servicios Mes</p>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card chart-card">
        <h4>Servicios por Conductor</h4>
        <div class="bar-chart">
          <div v-for="c in reporteConductores" :key="c.conductor_id" class="bar-item">
            <div class="bar-label">{{ c.nombre }}</div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: getBarWidth(c.total_servicios) + '%' }"></div>
            </div>
            <div class="bar-value">{{ c.total_servicios }}</div>
          </div>
          <p v-if="reporteConductores.length === 0" class="empty-chart">Sin datos</p>
        </div>
      </div>

      <div class="card chart-card">
        <h4>Servicios Recientes</h4>
        <div class="recent-list">
          <div v-for="s in serviciosRecientes" :key="s.id" class="recent-item">
            <div class="recent-left">
              <span class="badge badge-sm" :class="{
                'badge-success': s.estado === 'finalizado',
                'badge-danger': s.estado === 'cancelado',
                'badge-warning': s.estado === 'en_curso',
              }">{{ s.estado }}</span>
              <span class="recent-dest">{{ s.destino_texto }}</span>
            </div>
            <div class="recent-right">
              <span class="recent-price">${{ s.precio }}</span>
              <span class="recent-date">{{ formatDate(s.hora_inicio) }}</span>
            </div>
          </div>
          <p v-if="serviciosRecientes.length === 0" class="empty-chart">Sin servicios recientes</p>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: 20px">
      <h4 style="margin-bottom: 15px">Ingresos del Mes</h4>
      <div class="resumen-grid">
        <div class="resumen-item">
          <span class="resumen-label">Total Ingresos</span>
          <span class="resumen-value">${{ ingresosMes.total_ingresos.toLocaleString() }}</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Servicios Completados</span>
          <span class="resumen-value">{{ ingresosMes.total_servicios }}</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Promedio por Servicio</span>
          <span class="resumen-value">${{ promedioServicio }}</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../../../layouts/AdminLayout.vue';
import { useAdminStore } from '../../../stores/admin';

const adminStore = useAdminStore();
const stats = ref({ conductores: 0, disponibles: 0, serviciosHoy: 0, serviciosMes: 0 });
const reporteConductores = ref([]);
const serviciosRecientes = ref([]);
const ingresosMes = ref({ total_ingresos: 0, total_servicios: 0 });

const promedioServicio = computed(() => {
  if (ingresosMes.value.total_servicios === 0) return '0';
  return Math.round(ingresosMes.value.total_ingresos / ingresosMes.value.total_servicios).toLocaleString();
});

const getBarWidth = (total) => {
  const max = Math.max(...reporteConductores.value.map(c => c.total_servicios), 1);
  return (total / max) * 100;
};

const formatDate = (d) => new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });

onMounted(async () => {
  try {
    const [statsData, reportes, servicios, ingresos] = await Promise.all([
      adminStore.fetchStats(),
      adminStore.fetchReporteConductores(),
      adminStore.fetchReportes(),
      adminStore.fetchIngresos(),
    ]);
    stats.value = statsData;
    reporteConductores.value = reportes;
    serviciosRecientes.value = servicios.slice(0, 5);
    ingresosMes.value = ingresos;
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
.stat { text-align: center; padding: 25px 20px; }
.stat-icon { font-size: 2rem; margin-bottom: 8px; }
.stat h3 { font-size: 2.2rem; color: #2ecc71; margin-bottom: 5px; }
.stat p { color: #666; font-size: 14px; }

.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.chart-card h4 { margin-bottom: 15px; }

.bar-chart { display: flex; flex-direction: column; gap: 10px; }
.bar-item { display: flex; align-items: center; gap: 10px; }
.bar-label { width: 100px; font-size: 13px; font-weight: 600; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-track { flex: 1; height: 22px; background: #ecf0f1; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, #2ecc71, #27ae60); border-radius: 4px; transition: width 0.5s; }
.bar-value { width: 30px; font-size: 13px; font-weight: 700; color: #2c3e50; }

.recent-list { display: flex; flex-direction: column; gap: 10px; }
.recent-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.recent-left { display: flex; align-items: center; gap: 8px; }
.badge-sm { font-size: 11px; padding: 2px 8px; }
.recent-dest { font-size: 14px; }
.recent-right { text-align: right; }
.recent-price { font-weight: 700; color: #2ecc71; font-size: 14px; display: block; }
.recent-date { font-size: 11px; color: #999; }

.resumen-grid { display: flex; gap: 40px; }
.resumen-item { display: flex; flex-direction: column; }
.resumen-label { font-size: 13px; color: #666; }
.resumen-value { font-size: 1.8rem; font-weight: 700; color: #2ecc71; }

.empty-chart { text-align: center; color: #95a5a6; padding: 20px; font-size: 14px; }

@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .resumen-grid { flex-direction: column; gap: 15px; }
}
</style>
