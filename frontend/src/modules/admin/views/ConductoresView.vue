<template>
  <AdminLayout titulo="Gestión de Conductores">
    <div class="top-bar">
      <button @click="showForm = true" class="btn btn-primary">+ Registrar Conductor</button>
    </div>

    <div class="table-responsive">
      <div class="table-desktop">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Cédula</th><th>Teléfono</th><th>Email</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in conductores" :key="c.id">
              <td>
                <router-link :to="`/admin/conductores/${c.id}`" class="user-cell link">
                  <img v-if="c.usuario?.foto" :src="resolveFoto(c.usuario.foto)" class="avatar" />
                  <div v-else class="avatar avatar-text">{{ c.usuario?.nombre?.charAt(0) }}</div>
                  {{ c.usuario?.nombre }}
                </router-link>
              </td>
              <td>{{ c.usuario?.cedula }}</td>
              <td>{{ c.usuario?.telefono }}</td>
              <td>{{ c.usuario?.email }}</td>
              <td>
                <span class="badge" :class="c.usuario?.activo ? 'badge-success' : 'badge-danger'">
                  {{ c.usuario?.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="acciones">
                <router-link :to="`/admin/conductores/${c.id}`" class="btn btn-sm btn-outline">Ver</router-link>
                <button @click="editar(c)" class="btn btn-sm btn-outline">Editar</button>
                <button @click="confirmToggle(c)" class="btn btn-sm" :class="c.usuario?.activo ? 'btn-danger' : 'btn-primary'">
                  {{ c.usuario?.activo ? 'Inhabilitar' : 'Activar' }}
                </button>
              </td>
            </tr>
            <tr v-if="conductores.length === 0">
              <td colspan="6" class="empty-row">No hay conductores registrados</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mobile-cards">
        <div v-for="c in conductores" :key="'card-' + c.id" class="mobile-card">
          <div class="mobile-card-header">
            <img v-if="c.usuario?.foto" :src="resolveFoto(c.usuario.foto)" class="avatar" />
            <div v-else class="avatar avatar-text">{{ c.usuario?.nombre?.charAt(0) }}</div>
            <div>
              <router-link :to="`/admin/conductores/${c.id}`" class="mobile-card-title link">{{ c.usuario?.nombre }}</router-link>
              <div class="mobile-card-subtitle">{{ c.usuario?.cedula }}</div>
            </div>
          </div>
          <div class="mobile-card-body">
            <div class="mobile-card-row">
              <span class="mobile-card-label">📱 Teléfono</span>
              <span class="mobile-card-value">{{ c.usuario?.telefono || '—' }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">📧 Email</span>
              <span class="mobile-card-value">{{ c.usuario?.email }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">Estado</span>
              <span class="badge" :class="c.usuario?.activo ? 'badge-success' : 'badge-danger'">
                {{ c.usuario?.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
          <div class="mobile-card-actions">
            <router-link :to="`/admin/conductores/${c.id}`" class="btn btn-sm btn-outline">Ver</router-link>
            <button @click="editar(c)" class="btn btn-sm btn-outline">Editar</button>
            <button @click="confirmToggle(c)" class="btn btn-sm" :class="c.usuario?.activo ? 'btn-danger' : 'btn-primary'">
              {{ c.usuario?.activo ? 'Inhabilitar' : 'Activar' }}
            </button>
          </div>
        </div>
        <div v-if="conductores.length === 0" class="mobile-card">
          <div class="empty-row">No hay conductores registrados</div>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="cerrarForm">
      <div class="modal card">
        <h3>{{ editando ? 'Editar Conductor' : 'Registrar Conductor' }}</h3>
        <form @submit.prevent="registrar">
          <div class="form-row">
            <div class="form-group"><label>Nombre</label><input v-model="form.nombre" required /></div>
            <div class="form-group"><label>Cédula</label><input v-model="form.cedula" required :disabled="editando" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Teléfono</label><input v-model="form.telefono" /></div>
            <div class="form-group"><label>Email</label><input v-model="form.email" type="email" required /></div>
          </div>
          <div v-if="!editando" class="form-group">
            <label>Contraseña</label>
            <input v-model="form.password" type="password" required minlength="6" />
          </div>
          <div class="modal-actions">
            <button type="button" @click="cerrarForm" class="btn btn-outline">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmDialog
      :show="showConfirm"
      titulo="Cambiar estado del conductor"
      :mensaje="`¿Deseas ${toggleTarget?.usuario?.activo ? 'inhabilitar' : 'activar'} a ${toggleTarget?.usuario?.nombre}?`"
      :type="toggleTarget?.usuario?.activo ? 'danger' : 'primary'"
      :texto-confirmar="toggleTarget?.usuario?.activo ? 'Inhabilitar' : 'Activar'"
      @confirm="ejecutarToggle"
      @cancel="showConfirm = false"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../../layouts/AdminLayout.vue';
import ConfirmDialog from '../../../components/ConfirmDialog.vue';
import { useAdminStore } from '../../../stores/admin';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
const resolveFoto = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : API_BASE + url;
};

const adminStore = useAdminStore();
const conductores = ref([]);
const showForm = ref(false);
const showConfirm = ref(false);
const toggleTarget = ref(null);
const editando = ref(false);
const editId = ref(null);
const form = ref({ nombre: '', cedula: '', telefono: '', email: '', password: '' });

const registrar = async () => {
  if (editando.value) {
    await adminStore.actualizarConductor(editId.value, form.value);
  } else {
    await adminStore.crearConductor(form.value);
  }
  conductores.value = adminStore.conductores;
  cerrarForm();
};

const editar = (c) => {
  editando.value = true;
  editId.value = c.id;
  form.value = {
    nombre: c.usuario?.nombre || '',
    cedula: c.usuario?.cedula || '',
    telefono: c.usuario?.telefono || '',
    email: c.usuario?.email || '',
    password: '',
  };
  showForm.value = true;
};

const cerrarForm = () => {
  showForm.value = false;
  editando.value = false;
  editId.value = null;
  form.value = { nombre: '', cedula: '', telefono: '', email: '', password: '' };
};

const confirmToggle = (c) => {
  toggleTarget.value = c;
  showConfirm.value = true;
};

const ejecutarToggle = async () => {
  await adminStore.toggleConductor(toggleTarget.value.id);
  conductores.value = adminStore.conductores;
  showConfirm.value = false;
  toggleTarget.value = null;
};

onMounted(async () => { conductores.value = await adminStore.fetchConductores(); });
</script>

<style scoped>
.top-bar { margin-bottom: 20px; display: flex; justify-content: flex-end; }
.table-responsive { overflow-x: auto; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.link { text-decoration: none; color: inherit; }
.link:hover { color: #2ecc71; }
.avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid #2ecc71; }
.avatar-text { background: #2ecc71; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
.acciones { display: flex; gap: 6px; flex-wrap: wrap; }
.btn-sm { padding: 5px 10px; font-size: 12px; }
.empty-row { text-align: center; color: #95a5a6; padding: 30px !important; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal { width: 90%; max-width: 500px; }
.modal h3 { margin-bottom: 20px; }
.form-row { display: flex; gap: 15px; }
.form-row .form-group { flex: 1; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
</style>
