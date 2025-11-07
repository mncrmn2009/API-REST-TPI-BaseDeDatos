import { verificarToken } from "../services/auth.service.js";

/**
 * Middleware que verifica si el usuario está autenticado mediante JWT
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // El token debe venir como: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verificarToken(token);

  if (!decoded) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }

  // Guardamos la info del usuario en la request
  req.user = decoded;

  next();
};
