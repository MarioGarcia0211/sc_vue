import { Router } from "express";
import {
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuario,
  obtenerUsuarios,
  registarUsuario,
  obtenerUsuariosConPaginacion,
  buscarProfesorPorDocumento,
  buscarEstudiantePorDocumento,
} from "../controllers/usuario.controller.js";

const router = Router();

router.get("/usuarios", obtenerUsuarios);
router.post("/usuarios", registarUsuario);
router.get("/usuariospaginados/", obtenerUsuariosConPaginacion);
router.get("/usuarios/profesor/:documento", buscarProfesorPorDocumento);
router.get("/usuarios/estudiante/:documento", buscarEstudiantePorDocumento);

router.get("/usuarios/:id", obtenerUsuario);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

export default router;
