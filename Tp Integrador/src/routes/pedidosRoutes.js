import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { crearPedido } from "../controllers/pedidoController.js";

const router = express.Router();

// Ruta protegida: solo accesible si hay un token válido
router.post("/", authMiddleware, crearPedido);

export default router;
