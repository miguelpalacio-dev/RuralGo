<template>
  <ConductorLayout titulo="Mis Vehículos">
    <div v-if="vehiculos.length === 0" class="card empty">
      <p>No tienes vehículos registrados</p>
      <p style="font-size:13px;color:#95a5a6;margin-top:5px">Contacta al administrador para registrar tu vehículo</p>
    </div>

    <div v-for="v in vehiculos" :key="v.id" class="card vehiculo-card" :class="{ active: v.activo }">
      <div class="vehiculo-header">
        <div>
          <p class="placa">{{ v.placa }}</p>
          <p class="modelo">{{ v.marca }} {{ v.modelo }}</p>
        </div>
        <span class="badge" :class="v.activo ? 'badge-success' : 'badge-inactive'">
          {{ v.activo ? 'ACTIVO' : 'INACTIVO' }}
        </span>
      </div>
      <div class="vehiculo-detalle">
        <div class="detail-row"><span class="label">Color:</span><span>{{ v.color || 'N/A' }}</span></div>
      </div>
      <div class="vehiculo-docs">
        <span class="badge" :class="v.soat_verificado ? 'badge-success' : 'badge-danger'">
          SOAT {{ v.soat_verificado ? '✓' : '✗' }}
        </span>
        <span class="badge" :class="v.licencia_verificada ? 'badge-success' : 'badge-danger'">
          Licencia {{ v.licencia_verificada ? '✓' : '✗' }}
        </span>
      </div>
      <button v-if="!v.activo" @click="seleccionar(v.id)" class="btn btn-primary btn-block">Seleccionar como activo</button>
    </div>
  </ConductorLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ConductorLayout from '../../../layouts/ConductorLayout.vue';
import { useConductorStore } from '../../../stores/conductor';

const conductorStore = useConductorStore();
const vehiculos = ref([]);

const seleccionar = async (id) => {
  await conductorStore.seleccionarVehiculo(id);
  vehiculos.value = conductorStore.vehiculos;
};

onMounted(async () => { vehiculos.value = await conductorStore.fetchMisVehiculos(); });
</script>

<style scoped>
.vehiculo-card { transition: border-color 0.2s; border-left: 4px solid transparent; }
.vehiculo-card.active { border-left-color: #2ecc71; }
.vehiculo-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.placa { font-size: 1.3rem; font-weight: 700; color: #2c3e50; margin-bottom: 2px; }
.modelo { font-size: 14px; color: #555; }
.vehiculo-detalle { margin-bottom: 10px; }
.detail-row { display: flex; gap: 8px; font-size: 13px; color: #555; margin-bottom: 3px; }
.detail-row .label { font-weight: 600; color: #333; }
.vehiculo-docs { display: flex; gap: 8px; margin-bottom: 12px; }
.badge-inactive { background: #e9ecef; color: #6c757d; }
.btn-block { width: 100%; }
.empty { text-align: center; color: #95a5a6; padding: 40px; }
</style>
