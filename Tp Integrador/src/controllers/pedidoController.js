import { Pedido } from "../models/pedido.js";
import { Carrito } from "../models/carrito.js";
import { manejarError } from "../utils/manejarError.js";

/**
 * Crear pedido (a partir del carrito o datos directos)
 */
export const crearPedido = async (req, res, next) => {
  try {
    const { metodoPago, items } = req.body;
    const usuarioId = req.user?.id || req.body.usuario;

    if (!metodoPago) {
      const error = new Error("Debe indicar el método de pago");
      error.status = 400;
      return next(error);
    }

    let productosPedido = [];
    let total = 0;

    if (items && items.length > 0) {
      // Si el pedido viene con items en el body
      productosPedido = items.map((item) => ({
        producto: item.producto,
        cantidad: item.cantidad,
        subtotal: item.subtotal,
      }));
      total = productosPedido.reduce((acc, item) => acc + item.subtotal, 0);
    } else {
      // Si no se envían items, se toma desde el carrito del usuario
      const carrito = await Carrito.findOne({ usuario: usuarioId }).populate(
        "productos.producto",
        "precio nombre"
      );

      if (!carrito || carrito.productos.length === 0) {
        const error = new Error("El carrito está vacío o no existe");
        error.status = 400;
        return next(error);
      }

      productosPedido = carrito.productos.map((item) => ({
        producto: item.producto._id,
        cantidad: item.cantidad,
        subtotal: item.cantidad * item.producto.precio,
      }));
      total = productosPedido.reduce((acc, item) => acc + item.subtotal, 0);

      // Vaciar carrito después de crear el pedido
      carrito.productos = [];
      await carrito.save();
    }

    const nuevoPedido = await Pedido.create({
      usuario: usuarioId,
      items: productosPedido,
      total,
      metodoPago,
    });

    res.status(201).json({
      mensaje: "Pedido creado correctamente",
      pedido: nuevoPedido,
    });
  } catch (error) {
    next(manejarError(error, "Error al crear el pedido"));
  }
};

/**
 * Listar todos los pedidos (solo admin)
 */
export const listarPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find()
      .populate("usuario", "nombre email")
      .populate("items.producto", "nombre precio marca");

    if (pedidos.length === 0) {
      return res.status(204).json({ mensaje: "No hay pedidos registrados" });
    }

    res.status(200).json(pedidos);
  } catch (error) {
    next(manejarError(error, "Error al listar los pedidos"));
  }
};

/**
 * Obtener pedido por ID
 */
export const obtenerPedidoPorId = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("usuario", "nombre email")
      .populate("items.producto", "nombre precio marca");

    if (!pedido) {
      const error = new Error("Pedido no encontrado");
      error.status = 404;
      return next(error);
    }

    res.status(200).json(pedido);
  } catch (error) {
    next(manejarError(error, "Error al obtener el pedido"));
  }
};

/**
 * Actualizar estado del pedido
 */
export const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      const error = new Error("Debe indicar el nuevo estado del pedido");
      error.status = 400;
      return next(error);
    }

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!pedido) {
      const error = new Error("Pedido no encontrado");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ mensaje: "Estado actualizado correctamente", pedido });
  } catch (error) {
    next(manejarError(error, "Error al actualizar el estado del pedido"));
  }
};

/**
 * Eliminar pedido
 */
export const eliminarPedido = async (req, res, next) => {
  try {
    const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);

    if (!pedidoEliminado) {
      const error = new Error("Pedido no encontrado para eliminar");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ mensaje: "Pedido eliminado correctamente" });
  } catch (error) {
    next(manejarError(error, "Error al eliminar el pedido"));
  }
};

/**
 * Listar pedidos por usuario
 */
export const listarPedidosPorUsuario = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const pedidos = await Pedido.find({ usuario: userId })
      .populate("items.producto", "nombre precio marca");

    if (pedidos.length === 0) {
      return res.status(204).json({ mensaje: "El usuario no tiene pedidos" });
    }

    res.status(200).json(pedidos);
  } catch (error) {
    next(manejarError(error, "Error al listar pedidos del usuario"));
  }
};

/**
 * Estadísticas de pedidos (por estado)
 */
export const obtenerEstadisticas = async (req, res, next) => {
  try {
    const stats = await Pedido.aggregate([
      { $group: { _id: "$estado", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    next(manejarError(error, "Error al obtener estadísticas de pedidos"));
  }
};
