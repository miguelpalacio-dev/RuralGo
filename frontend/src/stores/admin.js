import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useAdminStore = defineStore('admin', () => {
  const conductores = ref([]);
  const vehiculos = ref([]);
  const stats = ref({ conductores: 0, disponibles: 0, serviciosHoy: 0, serviciosMes: 0 });
  const reportes = ref([]);

  const fetchStats = async () => {
    const { data } = await api.get('/admin/stats');
    stats.value = data;
    return data;
  };

  const fetchConductores = async () => {
    const { data } = await api.get('/admin/conductores');
    conductores.value = data;
    return data;
  };

  const crearConductor = async (payload) => {
    const { data } = await api.post('/admin/conductores', payload);
    await fetchConductores();
    return data;
  };

  const actualizarConductor = async (id, payload) => {
    await api.put(`/admin/conductores/${id}`, payload);
    await fetchConductores();
  };

  const toggleConductor = async (id) => {
    const { data } = await api.patch(`/admin/conductores/${id}/toggle`);
    await fetchConductores();
    return data;
  };

  const fetchVehiculos = async () => {
    const { data } = await api.get('/admin/vehiculos');
    vehiculos.value = data;
    return data;
  };

  const crearVehiculo = async (payload) => {
    const { data } = await api.post('/admin/vehiculos', payload);
    await fetchVehiculos();
    return data;
  };

  const actualizarVehiculo = async (id, payload) => {
    await api.put(`/admin/vehiculos/${id}`, payload);
    await fetchVehiculos();
  };

  const fetchReportes = async (params = {}) => {
    const { data } = await api.get('/admin/reportes/servicios', { params });
    reportes.value = data;
    return data;
  };

  const fetchIngresos = async (params = {}) => {
    const { data } = await api.get('/admin/reportes/ingresos', { params });
    return data;
  };

  const fetchReporteConductores = async (params = {}) => {
    const { data } = await api.get('/admin/reportes/conductores', { params });
    return data;
  };

  return {
    conductores, vehiculos, stats, reportes,
    fetchStats, fetchConductores, crearConductor, actualizarConductor, toggleConductor,
    fetchVehiculos, crearVehiculo, actualizarVehiculo,
    fetchReportes, fetchIngresos, fetchReporteConductores,
  };
});
