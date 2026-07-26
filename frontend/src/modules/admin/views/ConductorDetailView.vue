<template>
  <AdminLayout :titulo="`Conductor: ${conductor?.usuario?.nombre || ''}`">
    <div v-if="loading" class="card empty">Cargando...</div>
    <div v-else-if="conductor">
      <div class="detail-grid">
        <div class="card">
          <h4>Datos Personales</h4>
          <div class="info-list">
            <div class="info-row"><span class="label">Nombre:</span><span>{{ conductor.usuario?.nombre }}</span></div>
            <div class="info-row"><span class="label">Cédula:</span><span>{{ conductor.usuario?.cedula }}</span></div>
            <div class="info-row"><span class="label">Teléfono:</span><span>{{ conductor.usuario?.telefono || 'N/A' }}</span></div>
            <div class="info-row"><span class="label">Email:</span><span>{{ conductor.usuario?.email }}</span></div>
            <div class="info-row"><span class="label">Estado:</span>
              <span class="badge" :class="conductor.usuario?.activo ? 'badge-success' : 'badge-danger'">
                {{ conductor.usuario?.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="info-row"><span class="label">Disponible:</span>
              <span class="badge" :class="conductor.disponible ? 'badge-success' : 'badge-warning'">
                {{ conductor.disponible ? 'Sí' : 'No' }}
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <h4>Ubicación</h4>
          <div v-if="conductor.ubicacion" class="info-list">
            <div class="info-row"><span class="label">Latitud:</span><span>{{ conductor.ubicacion.latitud }}</span></div>
            <div class="info-row"><span class="label">Longitud:</span><span>{{ conductor.ubicacion.longitud }}</span></div>
            <div class="info-row"><span class="label">Última actualización:</span><span>{{ formatDate(conductor.ubicacion.updatedAt) }}</span></div>
          </div>
          <p v-else class="no-data">Sin ubicación registrada</p>
        </div>
      </div>

      <div class="card" style="margin-top: 20px">
        <h4>Vehículos ({{ conductor.vehiculos?.length || 0 }})</h4>
        <div v-if="conductor.vehiculos?.length > 0" class="vehiculos-list">
          <div v-for="v in conductor.vehiculos" :key="v.id" class="vehiculo-item">
            <div class="vehiculo-left">
              <p class="vehiculo-placa">{{ v.placa }}</p>
              <p class="vehiculo-info">{{ v.marca }} {{ v.modelo }} · {{ v.color }}</p>
            </div>
            <div class="vehiculo-right">
              <span class="badge" :class="v.activo ? 'badge-success' : 'badge-inactive'">
                {{ v.activo ? 'Activo' : 'Inactivo' }}
              </span>
              <span class="badge" :class="v.soat_verificado ? 'badge-success' : 'badge-danger'">SOAT</span>
              <span class="badge" :class="v.licencia_verificada ? 'badge-success' : 'badge-danger'">Licencia</span>
            </div>
          </div>
        </div>
        <p v-else class="no-data">Sin vehículos registrados</p>
      </div>

      <div class="card" style="margin-top: 20px">
        <h4>Servicios Recientes</h4>
        <div v-if="historial.length > 0">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Destino</th><th>Precio</th><th>Estado</th></tr>
            </thead>
            <tbody>
              <tr v-for="s in historial" :key="s.id">
                <td>{{ formatDate(s.hora_inicio) }}</td>
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
            </tbody>
          </table>
        </div>
        <p v-else class="no-data">Sin servicios registrados</p>
      </div>

      <div class="actions" style="margin-top: 20px">
        <router-link to="/admin/conductores" class="btn btn-outline">← Volver</router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from '../../../layouts/AdminLayout.vue';
import api from '../../../services/api';

const route = useRoute();
const conductor = ref(null);
const historial = ref([]);
const loading = ref(true);

const formatDate = (d) => d ? new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

onMounted(async () => {
  try {
    const id = route.params.id;
    const [conductorData, serviciosData] = await Promise.all([
      api.get(`/admin/conductores/${id}`),
      api.get('/admin/reportes/servicios', { params: { conductor_id: id } }),
    ]);
    conductor.value = conductorData.data;
    historial.value = serviciosData.data.slice(0, 10);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.info-list { display: flex; flex-direction: column; gap: 8px; }
.info-row { display: flex; justify-content: space-between; font-size: 14px; }
.info-row .label { font-weight: 600; color: #555; }
.no-data { color: #95a5a6; font-size: 14px; padding: 10px 0; }
.vehiculos-list { display: flex; flex-direction: column; gap: 10px; }
.vehiculo-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; }
.vehiculo-placa { font-weight: 700; font-size: 1.1rem; margin-bottom: 2px; }
.vehiculo-info { font-size: 13px; color: #666; }
.vehiculo-right { display: flex; gap: 6px; }
.badge-inactive { background: #e9ecef; color: #6c757d; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
th { background: #f8f9fa; font-weight: 600; }
@media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }
</style>
