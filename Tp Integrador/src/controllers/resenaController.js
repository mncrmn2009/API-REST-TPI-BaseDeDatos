import { Resena } from "../models/resena.js";
import { Producto } from "../models/producto.js";
import { manejarError } from "../utils/manejarError.js";

/**
 * 📊 Función auxiliar: recalcula reviewCount y avgRating del producto
 */
const actualizarEstadisticasProducto = async (productoId) => {
  const resenas = await Resena.find({ producto: productoId });

  const reviewCount = resenas.length;
  const avgRating = reviewCount > 0
    ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / reviewCount
    : 0;

  await Producto.findByIdAndUpdate(productoId, { reviewCount, avgRating });
};

export const crearResena = async (req, res, next) => {
  try {
    const { producto, calificacion, comentario } = req.body;

    // Validar campos
    if (!producto || !calificacion) {
      const error = new Error("Debe indicar producto y calificación");
      error.status = 400;
      return next(error);
    }

    // Crear reseña vinculada al usuario logueado
    const nuevaResena = await Resena.create({
      usuario: req.user.id, // viene del token JWT
      producto,
      calificacion,
      comentario,
    });

    // Actualizar estadísticas del producto
    await actualizarEstadisticasProducto(producto);

    res.status(201).json({
      mensaje: "Reseña creada correctamente",
      reseña: nuevaResena,
    });
  } catch (error) {
    next(manejarError(error, "Error al crear la reseña"));
  }
};

export const listarResenasPorProducto = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const resenas = await Resena.find({ producto: productId })
      .populate("usuario", "nombre email")
      .populate("producto", "nombre marca precio");

    if (resenas.length === 0) {
      return res.status(404).json({ mensaje: "Este producto no tiene reseñas" });
    }

    res.status(200).json(resenas);
  } catch (error) {
    next(manejarError(error, "Error al listar reseñas del producto"));
  }
};

export const obtenerTopProductos = async (req, res, next) => {
  try {
    const top = await Resena.aggregate([
      {
        $group: {
          _id: "$producto",
          promedio: { $avg: "$calificacion" },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { promedio: -1 } },
      { $limit: 5 },
    ]);

    const resultado = await Producto.populate(top, {
      path: "_id",
      select: "nombre marca precio",
    });

    res.status(200).json(resultado);
  } catch (error) {
    next(manejarError(error, "Error al obtener el top de productos reseñados"));
  }
};

export const actualizarResena = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { calificacion, comentario } = req.body;

    const resena = await Resena.findById(id);
    if (!resena) {
      const error = new Error("Reseña no encontrada");
      error.status = 404;
      return next(error);
    }

    if (resena.usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      const error = new Error("No tiene permisos para actualizar esta reseña");
      error.status = 403;
      return next(error);
    }

    if (calificacion !== undefined) resena.calificacion = calificacion;
    if (comentario !== undefined) resena.comentario = comentario;

    await resena.save();
    await actualizarEstadisticasProducto(resena.producto);

    res.status(200).json({ mensaje: "Reseña actualizada correctamente", resena });
  } catch (error) {
    next(manejarError(error, "Error al actualizar la reseña"));
  }
};

export const eliminarResena = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resena = await Resena.findById(id);

    if (!resena) {
      const error = new Error("Reseña no encontrada");
      error.status = 404;
      return next(error);
    }

    // Solo el usuario dueño o un admin puede eliminarla
    if (resena.usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      const error = new Error("No tiene permisos para eliminar esta reseña");
      error.status = 403;
      return next(error);
    }

    await resena.deleteOne();
    await actualizarEstadisticasProducto(resena.producto);

    res.status(200).json({ mensaje: "Reseña eliminada correctamente" });
  } catch (error) {
    next(manejarError(error, "Error al eliminar la reseña"));
  }
};
