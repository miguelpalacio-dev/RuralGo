<template>
  <div class="login-container">
    <div class="login-card card">
      <img src="/logo.png" alt="RuralGo" class="logo" />
      <p>Panel Administración</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="admin@ruralgo.com" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" required placeholder="••••••" />
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await auth.login(email.value, password.value, 'admin');
    router.push('/admin/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f2f5; }
.login-card { width: 100%; max-width: 380px; text-align: center; }
.logo { height: 70px; margin-bottom: 10px; }
.login-card p { color: #666; margin-bottom: 20px; }
.btn-block { width: 100%; }
.btn-block:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #e74c3c; margin-top: 10px; font-size: 14px; }
</style>
