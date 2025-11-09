import express from "express";
import { listarResenas, crearResena, listarResenasPorProducto, obtenerTopProductos, actualizarResena, eliminarResena, } from "../controllers/resenaController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// GET /api/resenas/top → top de productos por calificación
router.get("/top", obtenerTopProductos);

// GET /api/resenas/producto/:productoId → reseñas de un producto
router.get("/producto/:productoId", listarResenasPorProducto);

// POST /api/resenas → crear reseña (solo usuarios autenticados)
router.post("/", authMiddleware, crearResena);

// PATCH /api/resenas/:id → actualizar reseña (dueño o admin)
router.patch("/:id", authMiddleware, actualizarResena);

// DELETE /api/resenas/:id → eliminar reseña (dueño o admin)
router.delete("/:id", authMiddleware, eliminarResena);

// GET Listar todas las reseñas
router.get("/", listarResenas);

export default router;
