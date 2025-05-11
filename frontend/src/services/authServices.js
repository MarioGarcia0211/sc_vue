import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

// Iniciar sesión
export const login = async (correo, clave) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { correo, clave },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
};

// Registrarse
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al registrar usuario"
    );
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
