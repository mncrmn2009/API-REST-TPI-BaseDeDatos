import express from "express";
import { crearPedido, listarPedidos, obtenerPedidoPorId, actualizarEstado, eliminarPedido, listarPedidosPorUsuario, obtenerEstadisticas, } from "../controllers/pedidoController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// Estadísticas de pedidos (solo admin)
router.get("/estadisticas", authMiddleware, isAdmin, obtenerEstadisticas);

// Pedidos de un usuario (autenticado)
router.get("/usuario/:usuarioId", authMiddleware, listarPedidosPorUsuario);

// Crear pedido (cliente autenticado)
router.post("/", authMiddleware, crearPedido);

// Listar todos los pedidos (solo admin)
router.get("/", authMiddleware, isAdmin, listarPedidos);

// Obtener pedido por ID (autenticado)
router.get("/:id", authMiddleware, obtenerPedidoPorId);

// Actualizar estado (solo admin)
router.patch("/:id/status", authMiddleware, isAdmin, actualizarEstado);

// Eliminar pedido (solo admin)
router.delete("/:id", authMiddleware, isAdmin, eliminarPedido);

export default router;
