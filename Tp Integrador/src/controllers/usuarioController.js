import { Usuario } from "../models/usuario.js"

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error){
        res.status(500).json({mensaje: "Error al obtener usuarios", error: error.message});
    }
};

export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario){
            return res.status(404).json({mensaje: "Usuario no encontrado"});
        }
        res.status(200).json(usuario);
    } catch (error){
        res.status(500).json({mensaje: "Error al buscar el usuario", error: error.message});
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await Usuario.create(req.body);
        res.status(201).json({ mensaje: "Usuario creado correctamente", usuario: nuevoUsuario});
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear el usuario", error: error.message});
    }

};

export const eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado){
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        //Pendiente Eliminar el carrito del usuario tambien.
        // await Carrito.deleteOne({ usuarioId: req.params.id });

        res.status(200).json({ mensaje: "Usuario eliminado correctamente"});
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar usuario", error: error.message});
    }
};