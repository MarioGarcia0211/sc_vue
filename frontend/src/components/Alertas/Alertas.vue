<template></template>
<script setup>
import Swal from 'sweetalert2';

const mostrarToast = (icono, titulo, texto = '', clase = '') => {
  Swal.fire({
    toast: true,
    icon: icono,
    title: titulo,
    text: texto,
    position: window.innerWidth <= 600 ? 'top' : 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    showCloseButton: true,
    customClass: {
      popup: clase
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
};

defineExpose({
  mostrarToast
});
</script>