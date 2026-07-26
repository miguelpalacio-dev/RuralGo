import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'PublicHome',
    component: () => import('../modules/public/views/HomeView.vue'),
  },
  {
    path: '/conductor/login',
    name: 'ConductorLogin',
    component: () => import('../modules/conductor/views/LoginView.vue'),
  },
  {
    path: '/conductor/dashboard',
    name: 'ConductorDashboard',
    component: () => import('../modules/conductor/views/DashboardView.vue'),
    meta: { requiresAuth: true, role: 'conductor' },
  },
  {
    path: '/conductor/vehiculos',
    name: 'ConductorVehiculos',
    component: () => import('../modules/conductor/views/VehiculosView.vue'),
    meta: { requiresAuth: true, role: 'conductor' },
  },
  {
    path: '/conductor/servicio',
    name: 'ConductorServicio',
    component: () => import('../modules/conductor/views/ServicioView.vue'),
    meta: { requiresAuth: true, role: 'conductor' },
  },
  {
    path: '/conductor/historial',
    name: 'ConductorHistorial',
    component: () => import('../modules/conductor/views/HistorialView.vue'),
    meta: { requiresAuth: true, role: 'conductor' },
  },
  {
    path: '/conductor/perfil',
    name: 'ConductorPerfil',
    component: () => import('../modules/conductor/views/PerfilView.vue'),
    meta: { requiresAuth: true, role: 'conductor' },
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../modules/admin/views/LoginView.vue'),
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../modules/admin/views/DashboardView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/conductores',
    name: 'AdminConductores',
    component: () => import('../modules/admin/views/ConductoresView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/vehiculos',
    name: 'AdminVehiculos',
    component: () => import('../modules/admin/views/VehiculosView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/reportes',
    name: 'AdminReportes',
    component: () => import('../modules/admin/views/ReportesView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/perfil',
    name: 'AdminPerfil',
    component: () => import('../modules/admin/views/PerfilView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/conductores/:id',
    name: 'AdminConductorDetail',
    component: () => import('../modules/admin/views/ConductorDetailView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  if (to.meta.requiresAuth) {
    if (!token || !usuario) {
      return next({ name: to.name.startsWith('Admin') ? 'AdminLogin' : 'ConductorLogin' });
    }
    if (to.meta.role && usuario.rol !== to.meta.role) {
      return next({ name: 'PublicHome' });
    }
  }

  next();
});

export default router;
