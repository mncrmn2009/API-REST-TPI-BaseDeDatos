import { Usuario } from "../models/usuario.js"
import { manejarError } from "../utils/manejarError.js";
import { hashPassword } from "../services/password.service.js";

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
    const { nombre, email, password, telefono, rol, direcciones } = req.body;

    // 🔹 Hashear la contraseña antes de guardarla
    const passwordHasheado = await hashPassword(password);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHasheado,
      telefono,
      rol,
      direcciones,
    });

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    error.message = "Error al crear el usuario";
    next(error);
  }
};

export const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, rol, direcciones } = req.body;

    if (!nombre && !email && !telefono && !rol && !direcciones) {
      const error = new Error("Debe proporcionar al menos un campo para actualizar");
      error.status = 400;
      return next(error);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { nombre, email, telefono, rol, direcciones },
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      const error = new Error("Usuario no encontrado para actualizar");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    if (error.name === "CastError") {
      error.status = 400;
      error.message = "El ID proporcionado no es válido";
    } else {
      error.status = 500;
      error.message = "Error al actualizar el usuario";
    }
    next(error);
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