import { Usuario } from "../models/Usuario.js";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../libs/jwt.js";
import jwt from 'jsonwebtoken';

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { correo, clave } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ message: "Correo no registrado" });
    }

    const claveValida = await bcrypt.compare(clave, usuario.clave);
    if (!claveValida) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const payload = {
      id: usuario._id,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Registrarse
export const register = async (req, res) => {
  const {
    nombre,
    apellido,
    correo,
    clave,
    tipoDocumento,
    numeroDocumento,
    rol,
  } = req.body;

  try {
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !clave ||
      !tipoDocumento ||
      !numeroDocumento
    ) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios" });
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!correoValido) {
      return res.status(400).json({ mensaje: "El correo no es válido" });
    }

    const correoNormalizado = correo.toLowerCase().trim();

    const correoExistente = await Usuario.findOne({
      correo: correoNormalizado,
    });
    if (correoExistente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const documentoExistente = await Usuario.findOne({ numeroDocumento });
    if (documentoExistente) {
      return res
        .status(400)
        .json({ message: "El número de documento ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const claveCifrada = await bcrypt.hash(clave, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      correo: correoNormalizado,
      clave: claveCifrada,
      tipoDocumento,
      numeroDocumento,
      rol,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Perfil
export const profile = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-clave");

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Token actualizado
export const refreshToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token inválido" });

      const payload = {
        id: decoded.id,
        correo: decoded.correo,
        rol: decoded.rol,
      };

      const newAccessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "15m", // acceso corto
      });

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error al renovar token:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Cerrar sesión
export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
};