import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcrypt';

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { correo, clave } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ message: 'Correo no registrado' });
    }

    const claveValida = await bcrypt.compare(clave, usuario.clave);
    if (!claveValida) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }


    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
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