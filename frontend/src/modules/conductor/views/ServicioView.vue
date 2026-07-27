<template>
  <ConductorLayout titulo="Registrar Servicio">
    <div v-if="servicioEnCurso" class="card servicio-activo">
      <div class="servicio-header">
        <span class="servicio-status">●</span>
        <h4>Servicio en Curso</h4>
      </div>
      <div class="servicio-info">
        <div class="info-row"><span class="label">Tipo</span><span class="value">{{ servicioEnCurso.tipoServicio?.nombre }}</span></div>
        <div class="info-row"><span class="label">Destino</span><span class="value">{{ servicioEnCurso.destino_texto }}</span></div>
        <div class="info-row"><span class="label">Precio</span><span class="value price">{{ formatPrecio(servicioEnCurso.precio) }}</span></div>
        <div class="info-row"><span class="label">Inicio</span><span class="value">{{ formatTime(servicioEnCurso.hora_inicio) }}</span></div>
      </div>
      <div class="acciones">
        <button @click="finalizar" class="btn btn-primary">✓ Finalizar</button>
        <button @click="showConfirm = true" class="btn btn-danger">✕ Cancelar</button>
      </div>
    </div>

    <form v-else @submit.prevent="iniciarServicio" class="card">
      <h4 style="margin-bottom: 15px">Tipo de Servicio</h4>
      <div class="form-group">
        <div class="tipos">
          <label v-for="t in tiposServicio" :key="t.id" class="tipo-option" :class="{ active: form.tipo_servicio_id === t.id }">
            <input type="radio" :value="t.id" v-model="form.tipo_servicio_id" required />
            <span>{{ t.nombre }}</span>
            <small>{{ t.descripcion }}</small>
          </label>
        </div>
      </div>
      <div class="form-group">
        <label>Destino</label>
        <input v-model="form.destino_texto" type="text" required placeholder="Ej: Centro, Parque Principal..." />
      </div>
      <div class="form-group">
        <label>Precio ($)</label>
        <input v-model="form.precio" type="number" min="0" required placeholder="Ej: 15000" />
      </div>
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <button type="submit" class="btn btn-primary btn-block" :disabled="loading || !form.tipo_servicio_id">
        {{ loading ? 'Iniciando...' : '🚀 Iniciar Servicio' }}
      </button>
    </form>

    <ConfirmDialog
      :show="showConfirm"
      titulo="Cancelar servicio"
      mensaje="¿Estás seguro de cancelar el servicio en curso?"
      type="danger"
      texto-confirmar="Cancelar servicio"
      @confirm="cancelar"
      @cancel="showConfirm = false"
    />
  </ConductorLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ConductorLayout from '../../../layouts/ConductorLayout.vue';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';
import { useConductorStore } from '../../../stores/conductor';

const router = useRouter();
const conductorStore = useConductorStore();
const tiposServicio = ref([]);
const servicioEnCurso = ref(null);
const loading = ref(false);
const showConfirm = ref(false);
const errorMsg = ref('');

const form = ref({ tipo_servicio_id: null, destino_texto: '', precio: '' });

const formatTime = (d) => new Date(d).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

const formatPrecio = (v) => {
  if (!v) return '$0';
  return '$' + Number(v).toLocaleString('es-CO');
};

const iniciarServicio = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    servicioEnCurso.value = await conductorStore.crearServicio({
      ...form.value,
      precio: Number(form.value.precio),
    });
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al crear servicio';
  } finally {
    loading.value = false;
  }
};

const finalizar = async () => {
  await conductorStore.finalizarServicio(servicioEnCurso.value.id);
  servicioEnCurso.value = null;
};

const cancelar = async () => {
  await conductorStore.cancelarServicio(servicioEnCurso.value.id);
  servicioEnCurso.value = null;
  showConfirm.value = false;
};

onMounted(async () => {
  tiposServicio.value = await conductorStore.fetchTiposServicio();
  servicioEnCurso.value = await conductorStore.fetchServicioActivo();
});
</script>

<style scoped>
.error-msg { color: #e74c3c; font-size: 13px; margin-bottom: 10px; }
.tipos { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tipo-option {
  display: flex; flex-direction: column; padding: 12px; border: 2px solid #ddd;
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
}
.tipo-option input { display: none; }
.tipo-option span { font-weight: 600; }
.tipo-option small { color: #95a5a6; font-size: 12px; margin-top: 3px; }
.tipo-option.active, .tipo-option:has(input:checked) { border-color: #2ecc71; background: #eafaf1; }
.btn-block { width: 100%; margin-top: 10px; }
.btn-block:disabled { opacity: 0.6; }
.servicio-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.servicio-status { color: #2ecc71; font-size: 1.2rem; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.servicio-info { margin-bottom: 20px; }
.info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
.info-row .label { color: #666; }
.info-row .value { font-weight: 600; }
.info-row .price { color: #2ecc71; font-size: 1.2rem; }
.acciones { display: flex; gap: 10px; }
.acciones .btn { flex: 1; }
</style>
