<template>
  <div class="admin-layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <img src="/logo.png" alt="RuralGo" class="logo-sidebar" />
        <button class="close-btn" @click="sidebarOpen = false">✕</button>
      </div>
      <nav>
        <router-link to="/admin/dashboard" @click="sidebarOpen = false">📊 Dashboard</router-link>
        <router-link to="/admin/conductores" @click="sidebarOpen = false">👥 Conductores</router-link>
        <router-link to="/admin/vehiculos" @click="sidebarOpen = false">🏍️ Vehículos</router-link>
        <router-link to="/admin/reportes" @click="sidebarOpen = false">📈 Reportes</router-link>
        <router-link to="/admin/perfil" @click="sidebarOpen = false">👤 Mi Perfil</router-link>
      </nav>
      <div class="sidebar-footer">
        <p class="user-name">{{ auth.usuario?.nombre }}</p>
        <button @click="logout" class="btn btn-danger btn-block">Salir</button>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">☰</button>
        <h2>{{ titulo }}</h2>
      </header>
      <main class="main-content">
        <slot />
      </main>
    </div>

    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

defineProps({ titulo: { type: String, default: 'Dashboard' } });

const auth = useAuthStore();
const router = useRouter();
const sidebarOpen = ref(false);

const logout = () => {
  auth.logout();
  router.push('/admin/login');
};
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }

.sidebar {
  width: 240px; background: #1a252f; color: white; padding: 20px;
  display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; z-index: 100;
  transition: transform 0.3s;
}
.sidebar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
.logo-sidebar { height: 45px; }
.close-btn { display: none; background: none; border: none; color: white; font-size: 20px; cursor: pointer; }

.sidebar nav { flex: 1; }
.sidebar nav a {
  display: block; padding: 10px 12px; color: #ccc; border-radius: 6px; margin-bottom: 4px;
  transition: all 0.2s; font-size: 14px;
}
.sidebar nav a:hover { background: #2c3e50; color: white; }
.sidebar nav a.router-link-exact-active { background: #2ecc71; color: white; font-weight: 600; }

.sidebar-footer { padding-top: 15px; border-top: 1px solid #2c3e50; }
.user-name { color: #aaa; font-size: 13px; margin-bottom: 10px; }

.main-area { flex: 1; margin-left: 240px; }

.topbar {
  background: white; padding: 15px 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: flex; align-items: center; gap: 15px; position: sticky; top: 0; z-index: 50;
}
.topbar h2 { font-size: 18px; color: #2c3e50; }

.menu-toggle { display: none; background: none; border: none; font-size: 22px; cursor: pointer; }

.main-content { padding: 25px; }

.overlay { display: none; }

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .close-btn { display: block; }
  .main-area { margin-left: 0; }
  .menu-toggle { display: block; }
  .overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 90; }
}
</style>
