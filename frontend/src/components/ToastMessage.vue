<template>
  <div v-if="show" class="toast-overlay">
    <div class="toast" :class="type">
      <span class="toast-icon">{{ icon }}</span>
      <span>{{ mensaje }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: Boolean,
  mensaje: String,
  type: { type: String, default: 'success' },
});

const icon = computed(() => {
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  return icons[props.type] || icons.info;
});
</script>

<style scoped>
.toast-overlay {
  position: fixed; top: 20px; right: 20px; z-index: 4000;
}
.toast {
  display: flex; align-items: center; gap: 10px; padding: 12px 20px;
  border-radius: 8px; color: white; font-weight: 600; font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;
}
.toast.success { background: #2ecc71; }
.toast.error { background: #e74c3c; }
.toast.warning { background: #f39c12; }
.toast.info { background: #3498db; }
.toast-icon { font-size: 18px; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>
