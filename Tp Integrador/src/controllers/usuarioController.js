import { Usuario } from "../models/usuario.js"
import { manejarError } from "../utils/manejarError.js";

export const listarUsuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario.find();
        if (usuarios.length === 0) {
            const error = new Error("No hay usuarios registrados");
            error.status = 204;
            return next(error);
        }
        res.status(200).json(usuarios);
    } catch (error){
        next(manejarError(error, "Error al obtener los usuarios"));
    }
};

export const obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario){
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            return next(error);
        }
        res.status(200).json(usuario);
    } catch (error){
        next(manejarError(error, "Error al obtener los usuarios"));
    }
};

export const crearUsuario = async (req, res, next) => {
    try {
        const nuevoUsuario = await Usuario.create(req.body);
        res.status(201).json({ mensaje: "Usuario creado correctamente", usuario: nuevoUsuario});
    } catch (error) {
        next(manejarError(error, "Error al crear el usuario"))
    }

};

export const eliminarUsuario = async (req, res, next) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado){
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            return next(error)
        }

        //Pendiente Eliminar el carrito del usuario tambien.
        // await Carrito.deleteOne({ usuarioId: req.params.id });

        res.status(200).json({ mensaje: "Usuario eliminado correctamente"});
    } catch (error) {
        next(manejarError(error, "Error al eliminar el usuario"));
    }
};