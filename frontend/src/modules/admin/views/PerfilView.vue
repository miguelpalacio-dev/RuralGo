<template>
  <AdminLayout titulo="Mi Perfil">
    <div class="card perfil-card">
      <PhotoUpload placeholder="👤" />
    </div>

    <div class="card">
      <h4 style="margin-bottom: 15px">Datos Personales</h4>
      <form @submit.prevent="guardarPerfil">
        <div class="form-group">
          <label>Nombre completo</label>
          <input v-model="form.nombre" required />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input v-model="form.telefono" type="tel" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="guardando">
          {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
        </button>
        <p v-if="msgPerfil" class="msg" :class="msgPerfilTipo">{{ msgPerfil }}</p>
      </form>
    </div>

    <div class="card">
      <h4 style="margin-bottom: 15px">Cambiar Contraseña</h4>
      <form @submit.prevent="cambiarPassword">
        <div class="form-group">
          <label>Contraseña actual</label>
          <input v-model="passForm.password_actual" type="password" required />
        </div>
        <div class="form-group">
          <label>Nueva contraseña</label>
          <input v-model="passForm.password_nueva" type="password" required minlength="6" />
        </div>
        <button type="submit" class="btn btn-outline btn-block" :disabled="cambiandoPass">
          {{ cambiandoPass ? 'Cambiando...' : 'Cambiar contraseña' }}
        </button>
        <p v-if="msgPass" class="msg" :class="msgPassTipo">{{ msgPass }}</p>
      </form>
    </div>

    <div class="card info-card">
      <h4 style="margin-bottom: 10px">Información de cuenta</h4>
      <p><strong>Cédula:</strong> {{ perfil?.cedula }}</p>
      <p><strong>Rol:</strong> Administrador</p>
      <p><strong>Estado:</strong>
        <span class="badge badge-success">Activo</span>
      </p>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../../layouts/AdminLayout.vue';
import PhotoUpload from '../../../components/PhotoUpload.vue';
import { useAuthStore } from '../../../stores/auth';
import api from '../../../services/api';

const auth = useAuthStore();
const perfil = ref(null);
const form = ref({ nombre: '', telefono: '', email: '' });
const passForm = ref({ password_actual: '', password_nueva: '' });

const guardando = ref(false);
const msgPerfil = ref('');
const msgPerfilTipo = ref('');
const cambiandoPass = ref(false);
const msgPass = ref('');
const msgPassTipo = ref('');

const guardarPerfil = async () => {
  guardando.value = true;
  msgPerfil.value = '';
  try {
    const { data } = await api.put('/profile', form.value);
    auth.usuario.nombre = data.usuario.nombre;
    auth.usuario.email = data.usuario.email;
    auth.usuario.foto = data.usuario.foto;
    localStorage.setItem('usuario', JSON.stringify(auth.usuario));
    if (data.token) localStorage.setItem('token', data.token);
    msgPerfil.value = 'Perfil actualizado';
    msgPerfilTipo.value = 'msg-success';
  } catch (e) {
    msgPerfil.value = e.response?.data?.message || 'Error al actualizar';
    msgPerfilTipo.value = 'msg-error';
  } finally {
    guardando.value = false;
  }
};

const cambiarPassword = async () => {
  cambiandoPass.value = true;
  msgPass.value = '';
  try {
    await api.put('/profile/password', passForm.value);
    msgPass.value = 'Contraseña actualizada';
    msgPassTipo.value = 'msg-success';
    passForm.value = { password_actual: '', password_nueva: '' };
  } catch (e) {
    msgPass.value = e.response?.data?.message || 'Error al cambiar contraseña';
    msgPassTipo.value = 'msg-error';
  } finally {
    cambiandoPass.value = false;
  }
};

const cargarPerfil = async () => {
  try {
    const { data } = await api.get('/profile');
    perfil.value = data;
    form.value = { nombre: data.nombre || '', telefono: data.telefono || '', email: data.email || '' };
  } catch (e) {
    console.error('Error cargando perfil:', e);
  }
};

onMounted(cargarPerfil);
</script>

<style scoped>
.perfil-card { text-align: center; padding: 25px; }
.info-card p { margin-bottom: 6px; font-size: 14px; }
.btn-block { width: 100%; }
.btn-block:disabled { opacity: 0.6; }
.msg { margin-top: 10px; font-size: 13px; padding: 8px 12px; border-radius: 6px; }
.msg-success { background: #d4edda; color: #155724; }
.msg-error { background: #f8d7da; color: #721c24; }
</style>
