<template>
  <div class="photo-upload" @click="triggerInput">
    <input ref="input" type="file" accept="image/jpeg,image/png,image/webp" @change="handleFile" hidden />
    <div class="photo-preview" :class="{ uploading: uploading }">
      <img v-if="preview" :src="preview" alt="Foto" @error="onImgError" />
      <div v-else class="photo-placeholder">{{ placeholder }}</div>
      <div v-if="uploading" class="photo-overlay">
        <span class="spinner"></span>
      </div>
    </div>
    <p class="photo-label">Cambiar foto</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  placeholder: { type: String, default: '📷' },
});

const auth = useAuthStore();
const input = ref(null);
const preview = ref('');
const uploading = ref(false);

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const resolveUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) return API_BASE + url;
  return url;
};

watch(
  () => auth.usuario?.foto,
  (newFoto) => {
    preview.value = resolveUrl(newFoto);
  },
  { immediate: true }
);

const onImgError = () => {
  preview.value = '';
};

const triggerInput = () => input.value?.click();

const handleFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const localPreview = URL.createObjectURL(file);
  preview.value = localPreview;
  uploading.value = true;

  const formData = new FormData();
  formData.append('foto', file);

  try {
    const { data } = await api.post('/upload/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    auth.setFoto(data.foto);
    preview.value = resolveUrl(data.foto);
  } catch (err) {
    preview.value = resolveUrl(auth.usuario?.foto);
    alert('Error al subir imagen');
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.photo-upload { cursor: pointer; text-align: center; }
.photo-preview {
  width: 100px; height: 100px; border-radius: 50%; overflow: hidden;
  margin: 0 auto 8px; position: relative; background: #ddd;
  border: 3px solid #2ecc71; transition: opacity 0.2s;
}
.photo-preview.uploading { opacity: 0.6; }
.photo-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
.photo-placeholder {
  width: 100%; height: 100%; display: flex; align-items: center;
  justify-content: center; font-size: 2rem; color: #95a5a6;
}
.photo-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.4); color: white;
  display: flex; align-items: center; justify-content: center;
}
.spinner {
  width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.photo-label { font-size: 13px; color: #2ecc71; font-weight: 600; margin-top: 4px; }
</style>
