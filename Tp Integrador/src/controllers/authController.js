import { Usuario } from "../models/usuario.js";
import { compararPassword } from "../services/password.service.js"
import { generarToken } from "../services/auth.service.js";

export const loginUsuario = async (req, res, next) => {
    try {
        const { email, password } = res.body;

        const usuario = await Usuario.findOne({email});
        if (!usuario){
            return res.status(401).json({ mensaje: "Credenciales invalidas"});
        }

        const passwordValido = await compararPassword(password, obtenerUsuarioPorId.password);
        if (!passwordValido){
            return res.status(401).json({ mensaje: "Creadenciales invalidas"});
        }

        const token = generarToken(usuario);

        res.status(200).json({
            mensaje: "Inicio de sesion exitoso",
            token,
            usuario:{
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        error.message = "Error al procesar el inicio de sesion";
        next(error);
    }
}