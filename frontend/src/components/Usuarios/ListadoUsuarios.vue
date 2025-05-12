<template>
  <div class="">
    <!-- Titulo -->
    <h1 class="text-center">Listado de usuarios</h1>

    <!-- Filtros y acciones compactos -->
    <div class="d-flex flex-wrap align-items-end gap-2 mb-4">

      <!-- Input de búsqueda -->
      <div class="flex-grow-1">
        <label class="form-label mb-1">Buscar:</label>
        <input v-model="busqueda" type="text" class="form-control form-control-sm"
          placeholder="Nombre, correo, documento, rol..." @keyup.enter="busquedaConReinicio" />
      </div>

      <!-- Botones -->
      <div class="d-flex gap-2">
        <button class="btn btn-primary btn-sm" @click="busquedaConReinicio">
          <i class="bi bi-search"></i> Buscar
        </button>
        <button v-if="busqueda" class="btn btn-secondary btn-sm" @click="limpiarBusqueda">
          <i class="bi bi-x-circle"></i> Limpiar
        </button>
      </div>
    </div>

    <!-- Paginas y operaciones -->
    <div class="row align-items-center">

      <div class="col-md-2 mb-3">
        <div class="form-group">
          <label class="form-label">Mostrar por pagina:</label>
          <select id="usuariosPorPagina" v-model="usuariosPorPagina" class="form-select form-select-sm"
            @change="buscarUsuarios">
            <option v-for="n in [5, 10, 20, 50, 100, 200]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>

      <div class="col-md-10 d-flex justify-content-end mb-3">
        <div>
          <label class="form-label d-block">Operaciones:</label>
          <div class="d-flex gap-2">
            <router-link to="/usuarios/crear" class="btn btn-success btn-sm">
              <i class="bi bi-person-plus"></i> Crear usuario
            </router-link>
          </div>
        </div>
      </div>

    </div>

    <div v-if="cargando" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Tabla -->
    <div v-else class="table-responsive">
      <table class="table table-hover table-bordered text-center">
        <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo electrónico</th>
            <th>Tipo de documento</th>
            <th>Número de documento</th>
            <th>Rol</th>
            <th>Fecha de creación</th>
            <th>Fecha de actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario._id">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.apellido }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.tipoDocumento }}</td>
            <td>{{ usuario.numeroDocumento }}</td>
            <td>{{ usuario.rol }}</td>
            <td>{{ new Date(usuario.createdAt).toLocaleString('es-CO', {
              hour12: true, hour: '2-digit',
              minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
            }) }}</td>
            <td>{{ new Date(usuario.updatedAt).toLocaleString('es-CO', {
              hour12: true, hour: '2-digit',
              minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
            }) }}</td>

            <td>
              <button class="btn btn-sm btn-primary me-2" @click="editarUsuario(usuario._id)">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="eliminarUsuarioConfirmado(usuario._id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="usuarios.length === 0">
            <td colspan="9">No hay usuarios registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="row align-items-center mt-4 px-2">
      <div class="col-md-4 mb-2">
        <nav v-if="totalPaginas > 1">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: paginaActual === 1 }">
              <button class="page-link" @click="paginaActual = 1; buscarUsuarios()">
                <i class="bi bi-chevron-bar-left"></i>
              </button>
            </li>
            <li class="page-item" :class="{ disabled: paginaActual === 1 }">
              <button class="page-link" @click="paginaActual--; buscarUsuarios()">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li v-for="pagina in paginacionResumida" :key="pagina" class="page-item"
              :class="{ active: paginaActual === pagina }">
              <button class="page-link" @click="paginaActual = pagina; buscarUsuarios()">
                {{ pagina }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
              <button class="page-link" @click="paginaActual++; buscarUsuarios()">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
            <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
              <button class="page-link" @click="paginaActual = totalPaginas; buscarUsuarios()">
                <i class="bi bi-chevron-bar-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div class="col-md-8 text-end mb-2">
        <span>
          Página <strong>{{ paginaActual }}</strong> de <strong>{{ totalPaginas }}</strong>
          (<span class="text-muted">{{ totalUsuarios }}</span> usuarios)
        </span>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <ModalConfirmacion :visible="mostrarModal" titulo="Confirmar eliminación"
    :mensaje="`¿Estás seguro de que deseas eliminar a ${obtenerNombreUsuario(usuarioAEliminar)}?`"
    @confirmar="confirmarEliminacion" @cancelar="cancelarEliminacion" />

  <!-- Alerta -->
  <Alertas ref="alertasRef" />
</template>

<script>
import { obtenerUsuariosPorPaginacion, eliminarUsuario } from "../../services/usuarioService.js";
import ModalConfirmacion from '../ModalConfirmacion/ModalConfirmacion.vue';
import Alertas from '../Alertas/Alertas.vue';

export default {
  components: {
    ModalConfirmacion,
    Alertas
  },
  data() {
    return {
      cargando: false,
      usuarios: [],
      paginaActual: 1,
      usuariosPorPagina: 5,
      busqueda: "",
      totalUsuarios: 0,
      mostrarModal: false,
      usuarioAEliminar: null,
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.totalUsuarios / this.usuariosPorPagina);
    },
    paginacionResumida() {
      const total = this.totalPaginas;
      const actual = this.paginaActual;
      const rango = 1;
      let paginas = [];

      for (let i = actual - rango; i <= actual + rango; i++) {
        if (i > 0 && i <= total) paginas.push(i);
      }
      return [...new Set(paginas)];
    }
  },
  methods: {
    async buscarUsuarios() {
      this.cargando = true;
      try {
        const resultado = await obtenerUsuariosPorPaginacion(
          this.paginaActual,
          this.usuariosPorPagina,
          this.busqueda.trim()
        );

        this.usuarios = resultado.usuarios;
        this.totalUsuarios = resultado.total;

      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        this.usuarios = [];
        this.totalUsuarios = 0;
      } finally {
        this.cargando = false;
      }
    },
    busquedaConReinicio() {
      this.paginaActual = 1;
      this.buscarUsuarios();
    },
    limpiarBusqueda() {
      this.busqueda = '';
      this.paginaActual = 1;
      this.buscarUsuarios();
    },
    editarUsuario(id) {
      this.$router.push(`/usuarios/editar/${id}`);
    },
    eliminarUsuarioConfirmado(id) {
      this.usuarioAEliminar = id;
      this.mostrarModal = true;
    },
    async confirmarEliminacion() {
      try {
        await eliminarUsuario(this.usuarioAEliminar);
        if (this.usuarios.length === 1 && this.paginaActual > 1) {
          this.paginaActual--;
        }
        this.$refs.alertasRef.mostrarToast('success', 'Usuario eliminado correctamente', '', 'toast-success');
        this.buscarUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      } finally {
        this.mostrarModal = false;
        this.usuarioAEliminar = null;
      }
    },
    cancelarEliminacion() {
      this.mostrarModal = false;
      this.usuarioAEliminar = null;
    },
    obtenerNombreUsuario(id) {
      const usuario = this.usuarios.find(u => u._id === id);
      return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'este usuario';
    }

  },
  mounted() {
    this.buscarUsuarios();
  }
};
</script>

<style scoped>
h1 {
  text-transform: uppercase;
}

.table th,
.table td {
  white-space: nowrap;
  vertical-align: middle;
}
</style>