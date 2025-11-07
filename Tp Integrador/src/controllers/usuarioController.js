import { Usuario } from "../models/usuario.js"

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        if (usuarios.length === 0) {
            const error = new Error("No hay usuarios registrados");
            error.status = 204; // No Content
            return next(error);
        }
        res.status(200).json(usuarios);
    } catch (error){
        error.message = "Error al obtener usuarios";
        next(error);
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
        error.message = "Error al buscar el usuario";
        next(error);
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await Usuario.create(req.body);
        res.status(201).json({ mensaje: "Usuario creado correctamente", usuario: nuevoUsuario});
    } catch (error) {
        error.message = "Error al crear el usuario";
        next(error);
    }

};

export const eliminarUsuario = async (req, res) => {
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
        error.message = "Error al eliminar usuario";
        next(error);
    }
};