<template>
  <div class="container-register">
    <div class="card card-register shadow-lg">
      <div class="card-body card-body-register">
        <h1 class="text-center">Registrarse</h1>

        <form @submit.prevent="handleRegister">
          <div class="row align-items-center">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" v-model="nombre" @input="nombre = capitalizar(nombre)" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Apellido</label>
              <input type="text" class="form-control" v-model="apellido" @input="apellido = capitalizar(apellido)" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" v-model="correo" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" v-model="clave" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Tipo de documento</label>
              <select class="form-select" v-model="tipoDocumento">
                <option disabled value="">Elige un tipo</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Número del documento</label>
              <input type="number" class="form-control" v-model="numeroDocumento" />
            </div>
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Registrarse</button>
          </div>
        </form>

        <p class="mt-3 text-center">
          ¿Ya tienes cuenta?
          <router-link to="/iniciarSesion">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </div>
  <Alertas ref="alertasRef" />
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../services/authServices';
import Alertas from '../components/Alertas/Alertas.vue';

export default {
  components: {
    Alertas
  },
  setup() {
    const nombre = ref('');
    const apellido = ref('');
    const correo = ref('');
    const clave = ref('');
    const tipoDocumento = ref('');
    const numeroDocumento = ref('');
    const router = useRouter();
    const alertasRef = ref(null);

    const capitalizar = (texto) => {
      return texto.replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleRegister = async () => {
      if (!nombre.value || !apellido.value || !correo.value || !clave.value || !tipoDocumento.value || !numeroDocumento.value) {
        alertasRef.value.mostrarToast('error', 'Por favor, completa todos los campos.', '', 'toast-error');
        return;
      }

      const userData = {
        nombre: capitalizar(nombre.value.trim()),
        apellido: capitalizar(apellido.value.trim()),
        correo: correo.value.trim(),
        clave: clave.value,
        tipoDocumento: tipoDocumento.value,
        numeroDocumento: numeroDocumento.value
      };

      try {
        await register(userData);
        alertasRef.value.mostrarToast('success', 'Registro exitoso. Ahora puedes iniciar sesión.', '', 'toast-success');
        router.push('/');
      } catch (error) {
        alertasRef.value.mostrarToast('error', error.message || 'Error en el registro', '', 'toast-error');
      }
    };

    return {
      nombre,
      apellido,
      correo,
      clave,
      tipoDocumento,
      numeroDocumento,
      capitalizar,
      handleRegister,
      alertasRef
    };
  }
};
</script>

<style scoped>
.container-register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.card-register {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 10px;
}

.card-body-register {
  padding: 2rem;
}

.card-body-register h1 {
  text-transform: uppercase;
}

.btn-primary {
  font-size: 16px;
}

.text-center a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.text-center a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .card-body-register {
    padding: 1.5rem;
  }

  .btn-primary {
    font-size: 14px;
    padding: 8px;
  }
}
</style>