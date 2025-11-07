import express from "express";
import { loginUsuario } from "../controllers/authController.js";

const router = express.Router();

// Ruta para el login
router.post("/login", loginUsuario);

export default router;
