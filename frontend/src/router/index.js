import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Inicio from "../pages/Inicio.vue";
import Register from "../pages/Register.vue";

const routes = [
  {
    path: "/",
    redirect: () => {
      const isAuthenticated = !!localStorage.getItem("token");
      return isAuthenticated ? "/inicio" : "/iniciarSesion";
    },
  },
  { path: "/iniciarSesion", name: "Login", component: Login },
  { path: "/registrarse", name: "Register", component: Register },
  { path: "/inicio", name: "Inicio", component: Inicio },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.path === "/inicio" && !isAuthenticated) {
    next("/iniciarSesion");
  } else if (
    (to.path === "/iniciarSesion" || to.path === "/registrarse") &&
    isAuthenticated
  ) {
    next("/inicio");
  } else {
    next();
  }
});

export default router;
