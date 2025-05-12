import axios from "axios";

const API_URL = "http://localhost:4000/api";

// Obtener el token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Obtener todos los usuarios
export const obtenerTodosLosUsuarios = async () => {
  try {
    const respuesta = await axios.get(`${API_URL}/usuarios`, getAuthHeaders());
    return respuesta.data;
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw error;
  }
};

// Obtener todos los usuarios con paginación y con búsqueda
export const obtenerUsuariosPorPaginacion = async (
  pagina,
  limite,
  busqueda = ""
) => {
  try {
    const respuesta = await axios.get(`${API_URL}/usuariospaginados`, {
      params: {
        pagina,
        limite,
        busqueda,
        _: new Date().getTime(), // evitar caché
      },
      ...getAuthHeaders(),
    });
    return respuesta.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Crear nuevo usuario
export const crearUsuario = async (datos) => {
  try {
    const respuesta = await axios.post(
      `${API_URL}/usuarios`,
      datos,
      getAuthHeaders()
    );
    return respuesta.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al registrar usuario"
    );
  }
};

// Actualizar usuario
export const actualizarUsuario = async (id, datos) => {
  try {
    const respuesta = await axios.put(
      `${API_URL}/usuarios/${id}`,
      datos,
      getAuthHeaders()
    );
    return respuesta.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar usuario"
    );
  }
};

// Obtener un solo usuario por ID
export const obtenerUsuarioPorId = async (id) => {
  const respuesta = await axios.get(
    `${API_URL}/usuarios/${id}`,
    getAuthHeaders()
  );
  return respuesta.data;
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  const respuesta = await axios.delete(
    `${API_URL}/usuarios/${id}`,
    getAuthHeaders()
  );
  return respuesta.data;
};

// Buscar profesor por número de documento
export const buscarProfesorPorDocumento = async (documento) => {
  try {
    const respuesta = await axios.get(
      `${API_URL}/usuarios/profesor/${documento}`,
      getAuthHeaders()
    );
    return respuesta.data;
  } catch (error) {
    console.error("Error al buscar profesor por documento:", error);
    throw new Error(
      error.response?.data?.message || "Error al buscar profesor"
    );
  }
};

// Buscar estudiate por número de documento
export const buscarEstudiantePorDocumento = async (documento) => {
  try {
    const respuesta = await axios.get(
      `${API_URL}/usuarios/estudiante/${documento}`,
      getAuthHeaders()
    );
    console.log(respuesta);
    return respuesta.data;
  } catch (error) {
    console.error("Error al buscar estudiante por documento:", error);
    throw new Error(
      error.response?.data?.message || "Error al buscar estudiante"
    );
  }
};
