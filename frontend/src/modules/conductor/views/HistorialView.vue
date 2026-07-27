<template>
  <ConductorLayout titulo="Historial">
    <div class="filtros card">
      <div class="form-group" style="margin-bottom:0">
        <select v-model="filtro">
          <option value="todos">Todos</option>
          <option value="finalizado">Finalizados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>
      <div class="stats">
        <span class="stat-item">💰 ${{ totalIngresos.toLocaleString() }}</span>
        <span class="stat-item">✅ {{ totalFinalizados }} servicios</span>
      </div>
    </div>

    <div v-if="filtrados.length === 0" class="card empty">
      <p>📋 No hay servicios {{ filtro === 'todos' ? 'registrados' : filtro + 's' }}</p>
      <router-link v-if="filtro === 'todos'" to="/conductor/servicio" class="btn btn-primary" style="margin-top:10px">Registrar primer servicio</router-link>
    </div>

    <div v-for="s in filtrados" :key="s.id" class="card servicio-item" @click="toggleExpand(s.id)">
      <div class="servicio-top">
        <span class="badge" :class="{
          'badge-success': s.estado === 'finalizado',
          'badge-danger': s.estado === 'cancelado',
          'badge-warning': s.estado === 'en_curso',
        }">{{ s.estado }}</span>
        <span class="fecha">{{ formatDate(s.hora_inicio) }}</span>
      </div>
      <div class="servicio-body">
        <div class="route">
          <span class="route-from">📍 {{ s.origen_nombre }}</span>
          <span class="route-arrow">→</span>
          <span class="route-to">🏁 {{ s.destino_texto }}</span>
        </div>
      </div>
      <div class="servicio-footer">
        <span class="precio">${{ Number(s.precio).toLocaleString('es-CO') }}</span>
        <span class="tipo">{{ s.tipoServicio?.nombre }}</span>
      </div>
      <div v-if="expanded === s.id" class="servicio-detail">
        <p><strong>Tipo:</strong> {{ s.tipoServicio?.nombre }}</p>
        <p><strong>Inicio:</strong> {{ formatDateTime(s.hora_inicio) }}</p>
        <p v-if="s.hora_fin"><strong>Fin:</strong> {{ formatDateTime(s.hora_fin) }}</p>
        <p><strong>Estado:</strong> {{ s.estado }}</p>
      </div>
    </div>
  </ConductorLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ConductorLayout from '../../../layouts/ConductorLayout.vue';
import { useConductorStore } from '../../../stores/conductor';

const conductorStore = useConductorStore();
const servicios = ref([]);
const filtro = ref('todos');
const expanded = ref(null);

const filtrados = computed(() => {
  if (filtro.value === 'todos') return servicios.value;
  return servicios.value.filter(s => s.estado === filtro.value);
});

const totalIngresos = computed(() =>
  servicios.value.filter(s => s.estado === 'finalizado').reduce((sum, s) => sum + Number(s.precio), 0)
);

const totalFinalizados = computed(() =>
  servicios.value.filter(s => s.estado === 'finalizado').length
);

const formatDate = (d) => new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
const formatDateTime = (d) => new Date(d).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

const toggleExpand = (id) => { expanded.value = expanded.value === id ? null : id; };

onMounted(async () => { servicios.value = await conductorStore.fetchHistorial(); });
</script>

<style scoped>
.filtros { display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; }
.filtros select { padding: 8px 12px; border: 1.5px solid #ddd; border-radius: 6px; font-size: 14px; }
.stats { display: flex; gap: 15px; font-size: 14px; font-weight: 600; }
.stat-item { color: #2c3e50; }
.servicio-item { margin-bottom: 12px; cursor: pointer; transition: transform 0.15s; }
.servicio-item:hover { transform: translateY(-1px); }
.servicio-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.fecha { font-size: 13px; color: #666; }
.route { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.route-from, .route-to { font-size: 14px; }
.route-arrow { color: #95a5a6; }
.servicio-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #eee; margin-top: 10px; }
.precio { font-weight: 700; font-size: 1.1rem; color: #2ecc71; }
.tipo { font-size: 13px; color: #666; }
.empty { text-align: center; color: #95a5a6; padding: 40px; }
.servicio-detail { margin-top: 12px; padding-top: 10px; border-top: 1px dashed #ddd; font-size: 13px; color: #555; }
.servicio-detail p { margin-bottom: 5px; }
</style>
