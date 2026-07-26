import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'));

  const fotoUrl = computed(() => usuario.value?.foto || '');

  const login = async (email, password, rol) => {
    const { data } = await api.post('/auth/login', { email, password, rol });
    token.value = data.token;
    usuario.value = data.usuario;
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    return data;
  };

  const setFoto = (url) => {
    if (usuario.value) {
      usuario.value.foto = url;
      localStorage.setItem('usuario', JSON.stringify(usuario.value));
    }
  };

  const logout = () => {
    token.value = null;
    usuario.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const isAuthenticated = () => !!token.value;

  return { token, usuario, fotoUrl, login, setFoto, logout, isAuthenticated };
});
