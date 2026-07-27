import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useConductorStore = defineStore('conductor', () => {
  const miConductor = ref(null);
  const vehiculos = ref([]);
  const historial = ref([]);
  const servicioActivo = ref(null);
  const tiposServicio = ref([]);
  const perfil = ref(null);

  const fetchMiConductor = async () => {
    const { data } = await api.get('/conductor/mi-conductor');
    miConductor.value = data;
    return data;
  };

  const toggleDisponibilidad = async () => {
    const { data } = await api.patch('/conductor/disponibilidad');
    if (miConductor.value) miConductor.value.disponible = data.disponible;
    return data.disponible;
  };

  const actualizarUbicacion = async (latitud, longitud) => {
    await api.put('/conductor/ubicacion', { latitud, longitud });
  };

  const fetchMisVehiculos = async () => {
    const { data } = await api.get('/conductor/vehiculos');
    vehiculos.value = data;
    return data;
  };

  const seleccionarVehiculo = async (id) => {
    await api.put(`/conductor/vehiculos/${id}/seleccionar`);
    await fetchMisVehiculos();
  };

  const fetchTiposServicio = async () => {
    const { data } = await api.get('/tipos-servicio');
    tiposServicio.value = data;
    return data;
  };

  const crearServicio = async (payload) => {
    const { data } = await api.post('/conductor/servicios', payload);
    servicioActivo.value = data;
    return data;
  };

  const finalizarServicio = async (id) => {
    await api.put(`/conductor/servicios/${id}/finalizar`);
    servicioActivo.value = null;
  };

  const cancelarServicio = async (id) => {
    await api.put(`/conductor/servicios/${id}/cancelar`);
    servicioActivo.value = null;
  };

  const fetchHistorial = async () => {
    const { data } = await api.get('/conductor/historial');
    historial.value = data;
    return data;
  };

  const fetchServicioActivo = async () => {
    const { data } = await api.get('/conductor/servicio-activo');
    servicioActivo.value = data;
    return data;
  };

  const cancelarServicioActivo = async () => {
    await api.put('/conductor/servicio-activo/cancelar');
    servicioActivo.value = null;
  };

  const fetchPerfil = async () => {
    const { data } = await api.get('/profile');
    perfil.value = data;
    return data;
  };

  const updatePerfil = async (payload) => {
    const { data } = await api.put('/profile', payload);
    return data;
  };

  const changePassword = async (payload) => {
    const { data } = await api.put('/profile/password', payload);
    return data;
  };

  return {
    miConductor, vehiculos, historial, servicioActivo, tiposServicio, perfil,
    fetchMiConductor, toggleDisponibilidad, actualizarUbicacion,
    fetchMisVehiculos, seleccionarVehiculo, fetchTiposServicio,
    crearServicio, finalizarServicio, cancelarServicio, fetchHistorial,
    fetchPerfil, updatePerfil, changePassword,
    fetchServicioActivo, cancelarServicioActivo,
  };
});
