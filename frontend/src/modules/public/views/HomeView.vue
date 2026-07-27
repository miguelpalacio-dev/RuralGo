<template>
  <div class="public-home">
    <header class="header">
      <img src="/logo.png" alt="RuralGo" class="logo" />
      <h1>RuralGo</h1>
    </header>

    <div id="map" ref="mapContainer"></div>

    <div v-if="conductorSeleccionado" class="conductor-card card">
      <button class="close-card" @click="conductorSeleccionado = null">✕</button>
      <div class="card-header">
        <div class="conductor-avatar">{{ conductorSeleccionado.usuario.nombre.charAt(0) }}</div>
        <div>
          <h3>{{ conductorSeleccionado.usuario.nombre }}</h3>
          <span class="badge badge-success">Disponible</span>
        </div>
      </div>
      <div class="card-body">
        <div class="info-row" v-if="conductorSeleccionado.vehiculo">
          <span class="info-icon">🏍️</span>
          <span>{{ conductorSeleccionado.vehiculo.marca }} {{ conductorSeleccionado.vehiculo.modelo }}</span>
        </div>
        <div class="info-row" v-if="conductorSeleccionado.vehiculo">
          <span class="info-icon">🔢</span>
          <span>Placa: {{ conductorSeleccionado.vehiculo.placa }}</span>
        </div>
      </div>
      <div class="card-actions">
        <a :href="'tel:' + conductorSeleccionado.usuario.telefono" class="btn btn-primary">📞 Llamar</a>
        <a :href="'https://wa.me/' + conductorSeleccionado.usuario.telefono" target="_blank" class="btn btn-whatsapp">💬 WhatsApp</a>
      </div>
    </div>

    <footer class="footer">
      <router-link to="/conductor/login">¿Eres conductor? Inicia sesión</router-link>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../../services/api';

const mapContainer = ref(null);
const conductorSeleccionado = ref(null);

const motoIcon = L.divIcon({
  html: `<div style="
    width:42px;height:42px;border-radius:50%;
    background:#2ecc71;color:white;
    display:flex;align-items:center;justify-content:center;
    font-size:20px;cursor:pointer;
    box-shadow:0 3px 12px rgba(46,204,113,0.5);
    border:3px solid white;
  ">🏍️</div>`,
  className: 'moto-marker-wrap',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const userIcon = L.divIcon({
  html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">📍</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

onMounted(async () => {
  const map = L.map(mapContainer.value, { zoomControl: false }).setView([6.2442, -75.5812], 13);

  L.control.zoom({ position: 'topright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 14);
        L.marker([pos.coords.latitude, pos.coords.longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('📍 Tu ubicación');
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }

  try {
    const { data } = await api.get('/disponibles');
    data.forEach((c) => {
      const marker = L.marker([c.ubicacion.latitud, c.ubicacion.longitud], { icon: motoIcon })
        .addTo(map)
        .bindPopup(`<strong>${c.usuario.nombre}</strong><br>${c.vehiculo?.placa || ''}`);
      marker.on('click', () => {
        conductorSeleccionado.value = c;
        map.panTo([c.ubicacion.latitud, c.ubicacion.longitud]);
      });
    });
  } catch (e) {
    console.error('Error cargando conductores:', e);
  }
});
</script>

<style scoped>
.public-home { display: flex; flex-direction: column; height: 100vh; }
.header { background: #2ecc71; padding: 12px 20px; display: flex; align-items: center; gap: 10px; color: white; }
.header .logo { height: 36px; }
.header h1 { font-size: 20px; font-weight: 700; }
#map { flex: 1; border-radius: 0; z-index: 1; }

.conductor-card {
  position: fixed; bottom: 55px; left: 50%; transform: translateX(-50%);
  width: 92%; max-width: 420px; z-index: 1000; padding: 20px;
  animation: slideUp 0.3s ease;
}
@keyframes slideUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
.close-card { position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 18px; cursor: pointer; color: #999; }
.card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
.conductor-avatar { width: 48px; height: 48px; border-radius: 50%; background: #2ecc71; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; }
.card-header h3 { margin-bottom: 3px; font-size: 16px; }
.info-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; color: #555; }
.info-icon { font-size: 16px; }
.card-actions { display: flex; gap: 10px; margin-top: 15px; }
.card-actions .btn { flex: 1; text-align: center; }
.btn-whatsapp { background: #25d366; color: white; }
.btn-whatsapp:hover { background: #1da851; }

.footer { background: white; padding: 14px; text-align: center; border-top: 1px solid #eee; z-index: 2; }
.footer a { color: #2ecc71; font-weight: 600; font-size: 14px; }
</style>

<style>
.moto-marker-wrap { transition: transform 0.15s ease; }
.moto-marker-wrap:hover { transform: scale(1.15); }
</style>
