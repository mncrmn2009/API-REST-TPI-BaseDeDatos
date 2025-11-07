import express from "express";
import { listarUsuarios, obtenerUsuarioPorId, crearUsuario, eliminarUsuario } from "../controllers/usuarioController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

//GET /api/usuarios -> listar todos los usuarios
//router.get("/", listarUsuarios);
router.get("/", authMiddleware, listarUsuarios);

// GET /api/usuarios/:id → detalle de un usuario
//router.get("/:id", obtenerUsuarioPorId);
router.get("/:id", authMiddleware, obtenerUsuarioPorId);

// POST /api/usuarios → registrar usuario
router.post("/", crearUsuario);

// DELETE /api/usuarios/:id → eliminar usuario y su carrito
//router.delete("/:id", eliminarUsuario);
router.delete("/:id", authMiddleware, eliminarUsuario);

export default router;