<template>
  <ConductorLayout titulo="Mi Panel">
    <div v-if="servicioActivo" class="card servicio-activo-card">
      <div class="servicio-header">
        <span class="servicio-icon">🚗</span>
        <div>
          <h4>Servicio en curso</h4>
          <span class="badge badge-success">Activo desde {{ formatTime(servicioActivo.hora_inicio) }}</span>
        </div>
      </div>
      <div class="servicio-detalle">
        <p v-if="servicioActivo.tipoServicio"><strong>Tipo:</strong> {{ servicioActivo.tipoServicio.nombre }}</p>
        <p v-if="servicioActivo.destino_texto"><strong>Destino:</strong> {{ servicioActivo.destino_texto }}</p>
        <p v-if="servicioActivo.precio"><strong>Precio:</strong> ${{ servicioActivo.precio }}</p>
      </div>
      <div class="servicio-actions">
        <button @click="finalizar" class="btn btn-primary" style="flex:1">✅ Finalizar</button>
        <button @click="cancelar" class="btn btn-danger" style="flex:1">❌ Cancelar</button>
      </div>
    </div>

    <div class="card perfil-card">
      <div class="perfil-header">
        <PhotoUpload placeholder="👤" />
        <div class="perfil-info">
          <h3>{{ auth.usuario?.nombre }}</h3>
          <p class="email">{{ auth.usuario?.email }}</p>
          <span class="badge" :class="disponible ? 'badge-success' : 'badge-danger'">
            {{ disponible ? '● Disponible' : '○ No disponible' }}
          </span>
          <p v-if="disponible && ubicacionActiva" class="ubicacion-status">
            📍 Ubicación activa
            <span v-if="precision"> · {{ Math.round(precision) }}m</span>
          </p>
          <p v-if="errorPermiso" class="error-text">⚠️ Permiso de ubicación denegado</p>
        </div>
      </div>
      <button
        @click="toggleDisp"
        class="btn toggle-btn"
        :class="disponible ? 'btn-danger' : 'btn-primary'"
        :disabled="!!servicioActivo"
      >
        {{ disponible ? 'Apagar disponibilidad' : 'Encender disponibilidad' }}
      </button>
      <p v-if="servicioActivo" class="disabled-hint">No puedes cambiar disponibilidad durante un servicio</p>
    </div>

    <div class="card">
      <h4 style="margin-bottom: 12px">🏍️ Vehículo Activo</h4>
      <div v-if="vehiculoActivo" class="vehiculo-info">
        <p class="placa">{{ vehiculoActivo.placa }}</p>
        <p class="vehiculo-detalle">{{ vehiculoActivo.marca }} {{ vehiculoActivo.modelo }} · {{ vehiculoActivo.color }}</p>
      </div>
      <p v-else class="sin-vehiculo">Sin vehículo seleccionado</p>
      <router-link to="/conductor/vehiculos" class="btn btn-outline" style="width:100%; margin-top:12px">Cambiar vehículo</router-link>
    </div>

    <router-link v-if="!servicioActivo" to="/conductor/servicio" class="card card-action">
      <span>📝</span>
      <div>
        <strong>Registrar Servicio</strong>
        <p>Pasajero, encomienda, diligencia o mixto</p>
      </div>
    </router-link>

    <router-link to="/conductor/historial" class="card card-action">
      <span>📋</span>
      <div>
        <strong>Historial</strong>
        <p>Consulta tus servicios anteriores</p>
      </div>
    </router-link>

    <ConfirmDialog
      :show="showConfirm"
      titulo="Cancelar servicio"
      mensaje="¿Estás seguro de cancelar el servicio en curso?"
      type="danger"
      texto-confirmar="Cancelar servicio"
      @confirm="ejecutarCancelacion"
      @cancel="showConfirm = false"
    />
  </ConductorLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ConductorLayout from '../../../layouts/ConductorLayout.vue';
import PhotoUpload from '../../../components/PhotoUpload.vue';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';
import { useAuthStore } from '../../../stores/auth';
import { useConductorStore } from '../../../stores/conductor';

const auth = useAuthStore();
const conductorStore = useConductorStore();
const disponible = ref(false);
const vehiculoActivo = ref(null);
const servicioActivo = ref(null);
const ubicacionActiva = ref(false);
const precision = ref(null);
const errorPermiso = ref(false);
const showConfirm = ref(false);
let geoWatchId = null;

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

const startUbicacion = () => {
  if (ubicacionActiva.value || !navigator.geolocation) {
    if (!navigator.geolocation) errorPermiso.value = true;
    return;
  }

  geoWatchId = navigator.geolocation.watchPosition(
    async (pos) => {
      errorPermiso.value = false;
      precision.value = pos.coords.accuracy;
      try {
        await conductorStore.actualizarUbicacion(
          pos.coords.latitude,
          pos.coords.longitude,
          pos.coords.accuracy
        );
      } catch (e) { console.error('Error enviando ubicación:', e); }
    },
    (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        errorPermiso.value = true;
        disponible.value = false;
        conductorStore.toggleDisponibilidad();
      }
      ubicacionActiva.value = false;
    },
    { enableHighAccuracy: false, maximumAge: 10000, timeout: 15000 }
  );
  ubicacionActiva.value = true;
};

const stopUbicacion = () => {
  if (geoWatchId != null) {
    navigator.geolocation.clearWatch(geoWatchId);
    geoWatchId = null;
  }
  ubicacionActiva.value = false;
  precision.value = null;
};

const toggleDisp = async () => {
  disponible.value = await conductorStore.toggleDisponibilidad();
  if (disponible.value) {
    startUbicacion();
  } else {
    stopUbicacion();
  }
};

const finalizar = async () => {
  await conductorStore.finalizarServicio(servicioActivo.value.id);
  servicioActivo.value = null;
};

const cancelar = () => {
  showConfirm.value = true;
};

const ejecutarCancelacion = async () => {
  await conductorStore.cancelarServicio(servicioActivo.value.id);
  servicioActivo.value = null;
  showConfirm.value = false;
};

onMounted(async () => {
  try {
    const data = await conductorStore.fetchMiConductor();
    disponible.value = data.disponible;
    vehiculoActivo.value = data.vehiculoActivo;
    if (data.disponible) startUbicacion();

    const servicio = await conductorStore.fetchServicioActivo();
    servicioActivo.value = servicio;
  } catch (e) { console.error(e); }
});

onUnmounted(() => {
  stopUbicacion();
});
</script>

<style scoped>
.servicio-activo-card { border-left: 4px solid #2ecc71; margin-bottom: 15px; }
.servicio-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.servicio-icon { font-size: 2rem; }
.servicio-header h4 { margin-bottom: 4px; }
.servicio-detalle p { font-size: 13px; color: #555; margin-bottom: 4px; }
.servicio-actions { display: flex; gap: 10px; margin-top: 12px; }
.perfil-card { margin-bottom: 15px; }
.perfil-header { display: flex; align-items: center; gap: 20px; margin-bottom: 15px; }
.perfil-info h3 { margin-bottom: 2px; }
.email { color: #666; font-size: 13px; margin-bottom: 6px; }
.ubicacion-status { color: #27ae60; font-size: 12px; font-weight: 600; margin-top: 4px; }
.error-text { color: #e74c3c; font-size: 12px; margin-top: 4px; }
.disabled-hint { color: #95a5a6; font-size: 12px; margin-top: 6px; font-style: italic; }
.toggle-btn { width: 100%; }
.vehiculo-info { margin: 10px 0; }
.placa { font-size: 1.3rem; font-weight: 700; color: #2c3e50; }
.vehiculo-detalle { color: #666; }
.sin-vehiculo { color: #95a5a6; font-style: italic; margin: 10px 0; }
.card-action { display: flex; align-items: center; gap: 15px; cursor: pointer; transition: transform 0.15s; margin-bottom: 15px; }
.card-action:hover { transform: translateY(-2px); }
.card-action span { font-size: 2rem; }
.card-action p { color: #666; font-size: 13px; margin-top: 2px; }
</style>
