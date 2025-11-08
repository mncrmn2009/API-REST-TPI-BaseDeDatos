import express from "express";
import { listarUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario } from "../controllers/usuarioController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

//GET /api/usuarios -> listar todos los usuarios
//router.get("/", listarUsuarios);
router.get("/", authMiddleware, isAdmin, listarUsuarios);

// GET /api/usuarios/:id → detalle de un usuario
//router.get("/:id", obtenerUsuarioPorId);
router.get("/:id", authMiddleware, obtenerUsuarioPorId);

// POST /api/usuarios → registrar usuario
router.post("/", crearUsuario);

//PUT /api/usuarios/:id → actualizar usuario
router.put("/:id", authMiddleware,  isAdmin, actualizarUsuario);

// DELETE /api/usuarios/:id → eliminar usuario y su carrito
//router.delete("/:id", eliminarUsuario);
router.delete("/:id", authMiddleware, isAdmin, eliminarUsuario);

export default router;