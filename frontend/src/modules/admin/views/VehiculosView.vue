<template>
  <AdminLayout titulo="Gestión de Vehículos">
    <div class="top-bar">
      <button @click="showForm = true" class="btn btn-primary">+ Registrar Vehículo</button>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr><th>Placa</th><th>Marca / Modelo</th><th>Color</th><th>Conductor</th><th>SOAT</th><th>Licencia</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr v-for="v in vehiculos" :key="v.id">
            <td><strong>{{ v.placa }}</strong></td>
            <td>{{ v.marca }} {{ v.modelo }}</td>
            <td>{{ v.color }}</td>
            <td>{{ v.conductor?.usuario?.nombre }}</td>
            <td>
              <button class="badge-toggle" :class="v.soat_verificado ? 'badge-success' : 'badge-danger'" @click="toggleVerificacion(v, 'soat')">
                {{ v.soat_verificado ? '✓ Verificado' : '✗ No verificado' }}
              </button>
            </td>
            <td>
              <button class="badge-toggle" :class="v.licencia_verificada ? 'badge-success' : 'badge-danger'" @click="toggleVerificacion(v, 'licencia')">
                {{ v.licencia_verificada ? '✓ Verificada' : '✗ No verificada' }}
              </button>
            </td>
            <td>
              <span class="badge" :class="v.activo ? 'badge-success' : 'badge-danger'">
                {{ v.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button @click="editar(v)" class="btn btn-sm btn-outline">Editar</button>
            </td>
          </tr>
          <tr v-if="vehiculos.length === 0">
            <td colspan="8" class="empty-row">No hay vehículos registrados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="cerrarForm">
      <div class="modal card">
        <h3>{{ editando ? 'Editar Vehículo' : 'Registrar Vehículo' }}</h3>
        <form @submit.prevent="registrar">
          <div v-if="!editando" class="form-group">
            <label>Conductor</label>
            <select v-model="form.conductor_id" required>
              <option value="">Seleccionar conductor</option>
              <option v-for="c in conductores" :key="c.id" :value="c.id">{{ c.usuario?.nombre }}</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Placa</label><input v-model="form.placa" required placeholder="ABC123" :disabled="editando" /></div>
            <div class="form-group"><label>Color</label><input v-model="form.color" placeholder="Negro" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Marca</label><input v-model="form.marca" required placeholder="Yamaha" /></div>
            <div class="form-group"><label>Modelo</label><input v-model="form.modelo" required placeholder="XTZ 150" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>SOAT vence</label><input v-model="form.soat_vencimiento" type="date" /></div>
            <div class="form-group"><label>Licencia vence</label><input v-model="form.licencia_vencimiento" type="date" /></div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="cerrarForm" class="btn btn-outline">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmDialog
      :show="showConfirmVerif"
      titulo="Verificar documento"
      :mensaje="`¿Marcar ${verifTarget?.campo === 'soat' ? 'SOAT' : 'Licencia'} como ${verifTarget?.nuevoEstado ? 'verificado' : 'no verificado'} para ${verifTarget?.vehiculo?.placa}?`"
      type="primary"
      texto-confirmar="Confirmar"
      @confirm="ejecutarVerificacion"
      @cancel="showConfirmVerif = false"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../../layouts/AdminLayout.vue';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';
import { useAdminStore } from '../../../stores/admin';
import api from '../../../services/api';

const adminStore = useAdminStore();
const vehiculos = ref([]);
const conductores = ref([]);
const showForm = ref(false);
const editando = ref(false);
const editId = ref(null);
const form = ref({ conductor_id: '', placa: '', marca: '', modelo: '', color: '', soat_vencimiento: '', licencia_vencimiento: '' });

const showConfirmVerif = ref(false);
const verifTarget = ref(null);

const registrar = async () => {
  if (editando.value) {
    await adminStore.actualizarVehiculo(editId.value, form.value);
  } else {
    await adminStore.crearVehiculo(form.value);
  }
  vehiculos.value = adminStore.vehiculos;
  cerrarForm();
};

const editar = (v) => {
  editando.value = true;
  editId.value = v.id;
  form.value = {
    conductor_id: v.conductor_id,
    placa: v.placa,
    marca: v.marca,
    modelo: v.modelo,
    color: v.color || '',
    soat_vencimiento: v.soat_vencimiento || '',
    licencia_vencimiento: v.licencia_vencimiento || '',
  };
  showForm.value = true;
};

const cerrarForm = () => {
  showForm.value = false;
  editando.value = false;
  editId.value = null;
  form.value = { conductor_id: '', placa: '', marca: '', modelo: '', color: '', soat_vencimiento: '', licencia_vencimiento: '' };
};

const toggleVerificacion = (v, campo) => {
  const nuevoEstado = campo === 'soat' ? !v.soat_verificado : !v.licencia_verificada;
  verifTarget.value = { vehiculo: v, campo, nuevoEstado };
  showConfirmVerif.value = true;
};

const ejecutarVerificacion = async () => {
  const { vehiculo, campo, nuevoEstado } = verifTarget.value;
  const payload = {};
  if (campo === 'soat') payload.soat_verificado = nuevoEstado;
  else payload.licencia_verificada = nuevoEstado;

  await adminStore.actualizarVehiculo(vehiculo.id, payload);
  vehiculos.value = adminStore.vehiculos;
  showConfirmVerif.value = false;
  verifTarget.value = null;
};

onMounted(async () => {
  vehiculos.value = await adminStore.fetchVehiculos();
  const { data } = await api.get('/admin/conductores');
  conductores.value = data;
});
</script>

<style scoped>
.top-bar { margin-bottom: 20px; display: flex; justify-content: flex-end; }
.table-responsive { overflow-x: auto; }
.badge-toggle { border: none; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.badge-toggle:hover { opacity: 0.8; transform: scale(1.05); }
.btn-sm { padding: 5px 10px; font-size: 12px; }
.empty-row { text-align: center; color: #95a5a6; padding: 30px !important; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal { width: 90%; max-width: 500px; }
.modal h3 { margin-bottom: 20px; }
.form-row { display: flex; gap: 15px; }
.form-row .form-group { flex: 1; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
</style>
