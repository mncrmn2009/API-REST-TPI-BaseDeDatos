import { Usuario } from "../models/usuario.js";
import { compararPassword } from "../services/password.service.js"
import { generarToken } from "../services/auth.service.js";

export const loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Intentando login con:", email, password); 

    const usuario = await Usuario.findOne({ email });
    console.log("Usuario encontrado:", usuario); 

    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas (usuario no existe)" });
    }

    const passwordValido = await compararPassword(password, usuario.password);
    console.log("¿Contraseña válida?:", passwordValido);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Credenciales inválidas (contraseña incorrecta)" });
    }

    const token = generarToken(usuario);
    res.status(200).json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error en login:", error);
    error.message = "Error al procesar el inicio de sesión";
    next(error);
  }
};