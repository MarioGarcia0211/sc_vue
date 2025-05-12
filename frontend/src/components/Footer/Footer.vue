<template>
  <footer class="border-top py-3 px-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
    <div class="d-flex align-items-center justify-content-center mb-2 mb-md-0">
      <span>© Mario García</span>
    </div>
    <ul class="list-unstyled d-flex flex-wrap justify-content-center mb-0">
      <li v-for="icono in iconos" :key="icono.nombre" class="ms-3">
        <a
          :href="icono.url"
          :class="icono.clase"
          target="_blank"
          rel="noopener noreferrer"
          :title="capitalizar(icono.nombre)"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
        >
          <i :class="icono.icono"></i>
        </a>
      </li>
    </ul>
  </footer>
</template>

<script>
import * as bootstrap from 'bootstrap';
export default {
  data() {
    return {
      iconos: [
        { nombre: 'instagram', url: 'https://www.instagram.com', clase: 'instagram', icono: 'bi bi-instagram' },
        { nombre: 'facebook', url: 'https://www.facebook.com', clase: 'facebook', icono: 'bi bi-facebook' },
        { nombre: 'twitter', url: 'https://twitter.com', clase: 'twitter', icono: 'bi bi-twitter-x' },
        { nombre: 'whatsapp', url: 'https://wa.me/1234567890', clase: 'whatsapp', icono: 'bi bi-whatsapp' },
        { nombre: 'linkedin', url: 'https://www.linkedin.com', clase: 'linkedin', icono: 'bi bi-linkedin' },
        { nombre: 'github', url: 'https://github.com', clase: 'github', icono: 'bi bi-github' }
      ]
    };
  },
  mounted() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
  },
  methods: {
    capitalizar(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
};
</script>

<style scoped>
footer {
  background-color: #0c0022;
}

ul li a i {
  font-size: 1.5rem;
}

/* Colores individuales */
.instagram i {
  color: #E1306C;
}
.facebook i {
  color: #1877F2;
}
.twitter i {
  color: #000000;
}
.whatsapp i {
  color: #25D366;
}
.linkedin i {
  color: #0077B5;
}
.github i {
  color: #171515;
}
</style>
