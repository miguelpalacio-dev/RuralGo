<template>
  <div class="conductor-layout">
    <header class="topbar">
      <router-link to="/conductor/dashboard">
        <img src="/logo.png" alt="RuralGo" class="logo-header" />
      </router-link>
      <h2>{{ titulo }}</h2>
      <button @click="logout" class="btn btn-outline-white btn-sm">Salir</button>
    </header>
    <main class="main-content">
      <slot />
    </main>
    <nav class="bottom-nav">
      <router-link to="/conductor/dashboard" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span>Inicio</span>
      </router-link>
      <router-link to="/conductor/servicio" class="nav-item">
        <span class="nav-icon">📝</span>
        <span>Servicio</span>
      </router-link>
      <router-link to="/conductor/vehiculos" class="nav-item">
        <span class="nav-icon">🏍️</span>
        <span>Vehículos</span>
      </router-link>
      <router-link to="/conductor/historial" class="nav-item">
        <span class="nav-icon">📋</span>
        <span>Historial</span>
      </router-link>
      <router-link to="/conductor/perfil" class="nav-item">
        <span class="nav-icon">👤</span>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

defineProps({ titulo: { type: String, default: 'Conductor' } });

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push('/conductor/login');
};
</script>

<style scoped>
.conductor-layout { display: flex; flex-direction: column; min-height: 100vh; padding-bottom: 70px; }

.topbar {
  background: #2ecc71; padding: 12px 20px; display: flex; align-items: center; gap: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.logo-header { height: 36px; }
.topbar h2 { color: white; font-size: 16px; flex: 1; }
.btn-outline-white { background: transparent; border: 1.5px solid white; color: white; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }
.btn-sm { padding: 6px 12px; font-size: 12px; }

.main-content { flex: 1; padding: 15px; }

.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; background: white;
  display: flex; box-shadow: 0 -2px 8px rgba(0,0,0,0.1); z-index: 100;
}
.nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10px 5px;
  color: #95a5a6; font-size: 11px; transition: color 0.2s;
}
.nav-item.router-link-exact-active { color: #2ecc71; }
.nav-icon { font-size: 20px; margin-bottom: 2px; }
</style>
