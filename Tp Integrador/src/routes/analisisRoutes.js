import express from "express";
import { analisisResenas } from "../controllers/analisisController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// Solo admin puede ver análisis estadísticos
router.get("/resenas", authMiddleware, isAdmin, analisisResenas);

export default router;
