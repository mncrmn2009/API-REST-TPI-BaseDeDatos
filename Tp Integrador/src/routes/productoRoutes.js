import express from "express";
import { listarProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto, filtrarProductos, productosTop, actualizarStock, } from "../controllers/productoController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// GET /api/productos/filtro?marca=X&min=Y&max=Z → filtra por marca y rango de precio
router.get("/filtro", filtrarProductos);

// GET /api/productos/top → productos más reseñados
router.get("/top", productosTop);

// GET /api/productos → lista todos los productos (con categoría)
router.get("/", listarProductos);

// GET /api/productos/:id → detalle de producto
router.get("/:id", obtenerProductoPorId);

// PATCH /api/productos/:id/stock → actualizar stock (solo admin)
router.patch("/:id/stock", authMiddleware, isAdmin, actualizarStock);

// POST /api/productos → crear producto (solo admin)
router.post("/", authMiddleware, isAdmin, crearProducto);

// PATCH /api/productos/:id → actualizar producto (solo admin)
router.patch("/:id", authMiddleware, isAdmin, actualizarProducto);

// DELETE /api/productos/:id → eliminar producto (solo admin)
router.delete("/:id", authMiddleware, isAdmin, eliminarProducto);

export default router;
