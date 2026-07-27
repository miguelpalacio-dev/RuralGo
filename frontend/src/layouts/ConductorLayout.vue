<template>
  <div class="conductor-layout">
    <header class="topbar">
      <router-link to="/conductor/dashboard" class="brand-link">
        <img src="/logo.png" alt="RuralGo" class="logo-header" />
        <div class="brand-text">
          <span class="brand-name">RuralGo</span>
          <span class="brand-role">Conductor</span>
        </div>
      </router-link>
      <h2>{{ titulo }}</h2>
      <button @click="intentarLogout" class="btn-logout">Salir</button>
    </header>
    <main class="main-content">
      <slot />
    </main>
    <nav class="bottom-nav">
      <router-link to="/conductor/dashboard" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Inicio</span>
        <span class="nav-dot"></span>
      </router-link>
      <router-link to="/conductor/servicio" class="nav-item">
        <span class="nav-icon">📝</span>
        <span class="nav-label">Servicio</span>
        <span class="nav-dot"></span>
      </router-link>
      <router-link to="/conductor/vehiculos" class="nav-item">
        <span class="nav-icon">🏍️</span>
        <span class="nav-label">Vehículos</span>
        <span class="nav-dot"></span>
      </router-link>
      <router-link to="/conductor/historial" class="nav-item">
        <span class="nav-icon">📋</span>
        <span class="nav-label">Historial</span>
        <span class="nav-dot"></span>
      </router-link>
      <router-link to="/conductor/perfil" class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-label">Perfil</span>
        <span class="nav-dot"></span>
      </router-link>
    </nav>

    <ConfirmDialog
      :show="showLogoutConfirm"
      titulo="Servicio en curso"
      mensaje="Tienes un servicio activo. Si cierras sesión, el servicio se cancelará automáticamente. ¿Estás seguro?"
      type="danger"
      texto-confirmar="Cerrar sesión"
      @confirm="ejecutarLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useConductorStore } from '../stores/conductor';
import ConfirmDialog from '../components/ConfirmDialog.vue';

defineProps({ titulo: { type: String, default: 'Conductor' } });

const auth = useAuthStore();
const conductorStore = useConductorStore();
const router = useRouter();
const showLogoutConfirm = ref(false);

const intentarLogout = async () => {
  const servicio = conductorStore.servicioActivo;
  if (servicio) {
    showLogoutConfirm.value = true;
  } else {
    auth.logout();
    router.push('/conductor/login');
  }
};

const ejecutarLogout = async () => {
  try {
    await conductorStore.cancelarServicioActivo();
  } catch (e) { console.error(e); }
  auth.logout();
  router.push('/conductor/login');
};

onMounted(async () => {
  try {
    await conductorStore.fetchServicioActivo();
  } catch (e) { console.error(e); }
});
</script>

<style scoped>
.conductor-layout { display: flex; flex-direction: column; min-height: 100vh; padding-bottom: 72px; }

.topbar {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 20px rgba(39, 174, 96, 0.25);
  position: relative;
  z-index: 10;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-header { height: 38px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15)); }
.brand-text { display: flex; flex-direction: column; gap: 0; }
.brand-name { color: white; font-size: 16px; font-weight: 800; letter-spacing: -0.3px; text-shadow: 0 1px 2px rgba(0,0,0,0.1); line-height: 1.1; }
.brand-role { color: rgba(255,255,255,0.75); font-size: 10px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; }
.topbar h2 { color: white; font-size: 15px; font-weight: 500; flex: 1; opacity: 0.9; }
.btn-logout {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}
.btn-logout:hover { background: rgba(255,255,255,0.25); }

.main-content { flex: 1; padding: 15px; }

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
  z-index: 100;
  padding: 6px 0 8px;
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 5px 4px;
  color: #95a5a6;
  font-size: 10px;
  font-weight: 500;
  transition: color 0.2s;
  text-decoration: none;
  position: relative;
  gap: 2px;
}
.nav-item.router-link-exact-active { color: #2ecc71; }
.nav-item.router-link-exact-active .nav-dot { opacity: 1; transform: scaleX(1); }
.nav-icon { font-size: 20px; }
.nav-label { line-height: 1; }
.nav-dot {
  width: 16px;
  height: 3px;
  border-radius: 2px;
  background: #2ecc71;
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.25s ease;
  position: absolute;
  bottom: -2px;
}
</style>
