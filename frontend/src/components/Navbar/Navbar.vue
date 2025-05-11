<template>
  <nav class="navbar navbar-expand-lg sticky-top shadow">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <a class="navbar-brand mb-0 h1 titulo-navbar" href="/">Mi app</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header shadow">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-3">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link :class="['nav-link', route.path === '/inicio' ? 'active' : '']" to="/inicio">Inicio</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link :class="['nav-link', route.path === '/usuarios' ? 'active' : '']" to="/usuarios">Usuarios</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link :class="['nav-link', route.path === '/cursos' ? 'active' : '']" to="/cursos">Cursos</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" @click.prevent="handleLogout">
                <button class="btn btn-primary">Cerrar sesión</button>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { logout } from '../../services/authServices';

const router = useRouter();
const route = useRoute();

const isAuthenticated = ref(false);
const isAdmin = ref(false);

const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    isAuthenticated.value = false;
    isAdmin.value = false;
    router.push('/iniciarSesion');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    isAuthenticated.value = true;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.rol === 'Administrador') {
      isAdmin.value = true;
    }
  }
});
</script>

<style scoped>
.navbar {
  min-height: 70px;
  background-color: white;
}

.navbar-brand {
  font-weight: bold;
}

.nav-link:hover {
  color: #0d6efd;
  transform: scale(1.05);
}

.nav-link.active {
  font-weight: bold;
  color: #0d6efd !important;
  border-bottom: 3px solid #0d6efd;
}
</style>
