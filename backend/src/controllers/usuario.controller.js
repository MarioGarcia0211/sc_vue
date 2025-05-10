import { Usuario } from "../models/Usuario.js";
import bcrypt from "bcrypt";
import mongoose from 'mongoose';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-clave');
    res.json(usuarios);

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener los usuarios con paginación y busqueda
export const obtenerUsuariosConPaginacion = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 5;
    const busqueda = req.query.busqueda?.trim() || "";
    const skip = (pagina - 1) * limite;
    let filtro = {};
    if (busqueda !== "") {
      const esNumero = !isNaN(Number(busqueda));

      const condiciones = [
        { nombre: { $regex: busqueda, $options: "i" } },
        { apellido: { $regex: busqueda, $options: "i" } },
        { correo: { $regex: busqueda, $options: "i" } },
        { tipoDocumento: { $regex: busqueda, $options: "i" } },
        { rol: { $regex: busqueda, $options: "i" } },
      ];

      if (esNumero) {
        condiciones.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$numeroDocumento" },
              regex: busqueda,
              options: "i",
            },
          },
        });
      }

      filtro = { $or: condiciones };
    }

    const [usuarios, total] = await Promise.all([
      Usuario.find(filtro).select("-clave").skip(skip).limit(limite),
      Usuario.countDocuments(filtro),
    ]);

    res.json({
      usuarios,
      total,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener usuario por ID
export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID no válido' });
    }
    const usuario = await Usuario.findById(id).select('-clave');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Registar usuario
export const registarUsuario = async (req, res) => {
  const {
    nombre,
    apellido,
    correo,
    clave,
    tipoDocumento,
    numeroDocumento,
    rol
  } = req.body;

  try {
    if (!nombre || !apellido || !correo || !clave || !tipoDocumento || !numeroDocumento) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!correoValido) {
      return res.status(400).json({ mensaje: 'El correo no es válido' });
    }
    const correoNormalizado = correo.toLowerCase().trim();
    const correoExistente = await Usuario.findOne({ correo: correoNormalizado });
    if (correoExistente) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }
    const documentoExistente = await Usuario.findOne({ numeroDocumento });
    if (documentoExistente) {
      return res.status(400).json({ message: 'El número de documento ya está registrado' });
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
      rol
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      correo,
      tipoDocumento,
      numeroDocumento,
      rol
    } = req.body;

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (correo && correo !== usuario.correo) {
      const correoExistente = await Usuario.findOne({ correo });
      if (correoExistente) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }
    }

    if (numeroDocumento && numeroDocumento !== usuario.numeroDocumento) {
      const documentoExistente = await Usuario.findOne({ numeroDocumento });
      if (documentoExistente) {
        return res.status(400).json({ message: 'El número de documento ya está registrado' });
      }
    }

    if (nombre !== undefined) {
      usuario.nombre = nombre;
    }

    if (apellido !== undefined) {
      usuario.apellido = apellido;
    }

    if (correo !== undefined) {
      usuario.correo = correo;
    }

    if (tipoDocumento !== undefined) {
      usuario.tipoDocumento = tipoDocumento;
    }

    if (numeroDocumento !== undefined) {
      usuario.numeroDocumento = numeroDocumento;
    }

    if (rol !== undefined) {
      usuario.rol = rol;
    }
    await usuario.save();
    res.json({ message: 'Usuario actualizado exitosamente' });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Buscar un profesor por su numero de documento
export const buscarProfesorPorDocumento = async (req, res) => {
  try {
    const { documento } = req.params;
    const profesor = await Usuario.findOne({ numeroDocumento: documento, rol: 'Profesor' }).select('-clave');
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    res.json(profesor);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el profesor', error: error.message });
  }
};

// Buscar un estudiante por su numero de documento
export const buscarEstudiantePorDocumento = async (req, res) => {
  try {
    const { documento } = req.params;
    const estudiante = await Usuario.findOne({ numeroDocumento: documento, rol: 'Estudiante' }).select('-clave');
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el Estudiante', error: error.message });
  }
};