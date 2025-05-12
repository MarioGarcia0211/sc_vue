<template>
  <Navbar />
  <div class="container-fluid mt-3">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <router-link to="/usuarios" class="nav-link">Listado de usuarios</router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link active">{{ modoEdicion ? 'Actualizar usuario' : 'Crear usuario' }}
        </a>
      </li>
    </ul>
    <div class="contenedor my-4 shadow p-4 rounded">
      <h1 class="text-center">{{ modoEdicion ? 'Actualizar usuario' : 'Crear usuario' }}</h1>

      <form @submit.prevent="handleRegister">
        <div class="row align-items-center">
          <div class="col-md-6 mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" v-model="nombre" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Apellido</label>
            <input type="text" class="form-control" v-model="apellido" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" v-model="correo" />
          </div>

          <div class="col-md-6 mb-3" v-if="!modoEdicion">
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-control" v-model="clave" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Tipo de documento</label>
            <select class="form-select" v-model="tipoDocumento">
              <option disabled value="">Elige un tipo</option>
              <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
              <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
              <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            </select>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Número del documento</label>
            <input type="number" class="form-control" v-model="numeroDocumento" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Rol</label>
            <select class="form-select" v-model="rol">
              <option disabled value="">Elige un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Profesor">Profesor</option>
            </select>
          </div>
        </div>

        <div class="d-flex gap-2">
          <router-link to="/usuarios" type="button" class="btn btn-secondary">Cancelar</router-link>
          <button type="submit" class="btn btn-primary">
            {{ modoEdicion ? 'Actualizar usuario' : 'Crear usuario' }}
          </button>
        </div>
      </form>
    </div>
  </div>
  <Alertas ref="alertasRef" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from "../Navbar/Navbar.vue";
import Alertas from '../Alertas/Alertas.vue';
import { crearUsuario, actualizarUsuario, obtenerUsuarioPorId } from "../../services/usuarioService.js";

export default {
  components: {
    Navbar,
    Alertas
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const modoEdicion = ref(false);
    const usuarioId = ref(null);

    const nombre = ref('');
    const apellido = ref('');
    const correo = ref('');
    const clave = ref('');
    const tipoDocumento = ref('');
    const numeroDocumento = ref('');
    const rol = ref('');
    const alertasRef = ref(null);

    const cargarUsuario = async (id) => {
      try {
        const usuario = await obtenerUsuarioPorId(id);
        nombre.value = usuario.nombre;
        apellido.value = usuario.apellido;
        correo.value = usuario.correo;
        tipoDocumento.value = usuario.tipoDocumento;
        numeroDocumento.value = usuario.numeroDocumento;
        rol.value = usuario.rol;
        clave.value = '';
      } catch (error) {
        alertasRef.value.mostrarToast('error', 'Error al cargar el usuario', '', 'toast-error');
      }
    };

    const handleRegister = async () => {
      if (!nombre.value || !apellido.value || !correo.value || (!modoEdicion.value && !clave.value) || !tipoDocumento.value || !numeroDocumento.value || !rol.value) {
        alertasRef.value.mostrarToast('error', 'Por favor, completa todos los campos.', '', 'toast-error');
        return;
      }

      const datos = {
        nombre: nombre.value.trim(),
        apellido: apellido.value.trim(),
        correo: correo.value.trim(),
        tipoDocumento: tipoDocumento.value,
        numeroDocumento: numeroDocumento.value,
        rol: rol.value
      };

      if (!modoEdicion.value) {
        datos.clave = clave.value;
      }

      try {
        if (modoEdicion.value) {
          await actualizarUsuario(usuarioId.value, datos);
          alertasRef.value.mostrarToast('success', 'Usuario actualizado correctamente.', '', 'toast-success');
        } else {
          await crearUsuario({ ...datos, clave: clave.value });
          alertasRef.value.mostrarToast('success', 'Usuario creado correctamente.', '', 'toast-success');
        }

        router.push('/usuarios');
      } catch (error) {
        alertasRef.value.mostrarToast('error', error.message || 'Error al guardar', '', 'toast-error');
      }
    };

    onMounted(async () => {
      if (route.params.id) {
        modoEdicion.value = true;
        usuarioId.value = route.params.id;
        await cargarUsuario(usuarioId.value);
      }
    });

    return {
      nombre,
      apellido,
      correo,
      clave,
      tipoDocumento,
      numeroDocumento,
      rol,
      handleRegister,
      alertasRef,
      modoEdicion
    };
  }
}
</script>

<style>
h1 {
  text-transform: uppercase;
}
</style>