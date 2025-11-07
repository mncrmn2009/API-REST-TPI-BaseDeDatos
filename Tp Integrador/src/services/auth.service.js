import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "default-secret";

/**
 * Genera un token JWT a partir de un objeto usuario
 * @param {Object} user - Usuario (id, email, rol, etc.)
 * @returns {string} - Token firmado
 */
export const generarToken = (usuario) => {
  // Incluimos solo datos seguros dentro del token (nunca la contraseña)
  const datosUsuario = {
    id: usuario._id,
    email: usuario.email,
    rol: usuario.rol,
  };

  return jwt.sign(datosUsuario, secret, { expiresIn: "1h" });
};

/**
 * Verifica un token JWT recibido
 * @param {string} token - Token recibido del cliente
 * @returns {Object|null} - Devuelve el payload decodificado o null si es inválido
 */
export const verificarToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};