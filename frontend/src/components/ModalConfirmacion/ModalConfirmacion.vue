<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-container">
      <div class="modal-content shadow rounded p-4 bg-white">
        <h5 class="mb-3">{{ titulo }}</h5>
        <p>{{ mensaje }}</p>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-secondary btn-sm" @click="cancelar">Cancelar</button>
          <button class="btn btn-danger btn-sm" @click="confirmar">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  titulo: String,
  mensaje: String,
});

const emit = defineEmits(['confirmar', 'cancelar']);

const confirmar = () => emit('confirmar');
const cancelar = () => emit('cancelar');
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-container {
  max-width: 400px;
  width: 90%;
}
</style>