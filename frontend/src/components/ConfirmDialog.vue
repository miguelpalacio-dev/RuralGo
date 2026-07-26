<template>
  <Teleport to="body">
    <div v-if="show" class="confirm-overlay" @click.self="cancel">
      <div class="confirm-dialog card">
        <div class="confirm-icon" :class="type">{{ icon }}</div>
        <h3>{{ titulo }}</h3>
        <p>{{ mensaje }}</p>
        <div class="confirm-actions">
          <button @click="cancel" class="btn btn-outline">Cancelar</button>
          <button @click="confirm" class="btn" :class="type === 'danger' ? 'btn-danger' : 'btn-primary'">
            {{ textoConfirmar }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  titulo: { type: String, default: 'Confirmar' },
  mensaje: { type: String, default: '¿Estás seguro?' },
  textoConfirmar: { type: String, default: 'Confirmar' },
  type: { type: String, default: 'primary' },
});

const emit = defineEmits(['confirm', 'cancel']);

const icon = props.type === 'danger' ? '⚠️' : '✓';

const confirm = () => emit('confirm');
const cancel = () => emit('cancel');
</script>

<style scoped>
.confirm-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex;
  align-items: center; justify-content: center; z-index: 3000;
}
.confirm-dialog {
  width: 90%; max-width: 380px; text-align: center; padding: 30px;
}
.confirm-icon { font-size: 2.5rem; margin-bottom: 10px; }
.confirm-icon.danger { color: #e74c3c; }
.confirm-icon.primary { color: #2ecc71; }
.confirm-dialog h3 { margin-bottom: 8px; }
.confirm-dialog p { color: #666; margin-bottom: 20px; font-size: 14px; }
.confirm-actions { display: flex; gap: 10px; }
.confirm-actions .btn { flex: 1; }
</style>
