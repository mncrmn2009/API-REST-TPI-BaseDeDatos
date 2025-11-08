import express from "express";
import { listarCategorias, obtenerCategoriaPorId, crearCategoria, actualizarCategoria, eliminarCategoria } from "../controllers/categoriaController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

router.get("/", listarCategorias);           // Obtener todas
router.get("/:id", obtenerCategoriaPorId);   // Obtener por ID

router.post("/", authMiddleware, isAdmin, crearCategoria);            // Crear nueva
router.put("/:id", authMiddleware, isAdmin, actualizarCategoria);     // Actualizar existente
router.delete("/:id", authMiddleware, isAdmin, eliminarCategoria);    // Eliminar

export default router;
