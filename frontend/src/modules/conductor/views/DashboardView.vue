<template>
  <ConductorLayout titulo="Mi Panel">
    <div class="card perfil-card">
      <div class="perfil-header">
        <PhotoUpload placeholder="👤" />
        <div class="perfil-info">
          <h3>{{ auth.usuario?.nombre }}</h3>
          <p class="email">{{ auth.usuario?.email }}</p>
          <span class="badge" :class="disponible ? 'badge-success' : 'badge-danger'">
            {{ disponible ? '● Disponible' : '○ No disponible' }}
          </span>
        </div>
      </div>
      <button @click="toggleDisp" class="btn toggle-btn" :class="disponible ? 'btn-danger' : 'btn-primary'">
        {{ disponible ? 'Apagar disponibilidad' : 'Encender disponibilidad' }}
      </button>
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

    <router-link to="/conductor/servicio" class="card card-action">
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
  </ConductorLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ConductorLayout from '../../../layouts/ConductorLayout.vue';
import PhotoUpload from '../../../components/PhotoUpload.vue';
import { useAuthStore } from '../../../stores/auth';
import { useConductorStore } from '../../../stores/conductor';

const auth = useAuthStore();
const conductorStore = useConductorStore();
const disponible = ref(false);
const vehiculoActivo = ref(null);

const toggleDisp = async () => {
  disponible.value = await conductorStore.toggleDisponibilidad();
};

onMounted(async () => {
  try {
    const data = await conductorStore.fetchMiConductor();
    disponible.value = data.disponible;
    vehiculoActivo.value = data.vehiculoActivo;
  } catch (e) { console.error(e); }
});
</script>

<style scoped>
.perfil-card { margin-bottom: 15px; }
.perfil-header { display: flex; align-items: center; gap: 20px; margin-bottom: 15px; }
.perfil-info h3 { margin-bottom: 2px; }
.email { color: #666; font-size: 13px; margin-bottom: 6px; }
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
