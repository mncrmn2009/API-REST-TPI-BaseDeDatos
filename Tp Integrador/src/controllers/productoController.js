import { Producto } from "../models/producto.js";
import { Categoria } from "../models/categoria.js";
import { manejarError } from "../utils/manejarError.js";

export const listarProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find().populate("categoria", "nombre descripcion");

    if (!productos || productos.length === 0) {
      return res.status(204).json({ mensaje: "No hay productos registrados" });
    }

    res.status(200).json(productos);
  } catch (error) {
    next(manejarError(error, "Error al listar los productos"));
  }
};

export const filtrarProductos = async (req, res, next) => {
  try {
    const { marca, min, max } = req.query;
    const filtro = {};

    if (marca) filtro.marca = marca;
    if (min || max) filtro.precio = {};
    if (min) filtro.precio.$gte = parseFloat(min);
    if (max) filtro.precio.$lte = parseFloat(max);

    const productos = await Producto.find(filtro).populate("categoria", "nombre");

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron productos con ese filtro" });
    }

    res.status(200).json(productos);
  } catch (error) {
    next(manejarError(error, "Error al filtrar productos"));
  }
};

export const productosTop = async (req, res, next) => {
  try {
    const productos = await Producto.find()
      .sort({ reviewCount: -1 }) // Orden descendente
      .limit(5)
      .populate("categoria", "nombre descripcion");

    if (productos.length === 0) {
      return res.status(204).json({ mensaje: "No hay productos reseñados" });
    }

    res.status(200).json(productos);
  } catch (error) {
    next(manejarError(error, "Error al obtener productos más reseñados"));
  }
};

export const actualizarStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      const error = new Error("Debe proporcionar el nuevo valor de stock");
      error.status = 400;
      return next(error);
    }

    const producto = await Producto.findByIdAndUpdate(
      id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!producto) {
      const error = new Error("Producto no encontrado para actualizar stock");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ mensaje: "Stock actualizado correctamente", producto });
  } catch (error) {
    next(manejarError(error, "Error al actualizar el stock del producto"));
  }
};

export const obtenerProductoPorId = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id).populate("categoria", "nombre descripcion");

    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      return next(error);
    }

    res.status(200).json(producto);
  } catch (error) {
    next(manejarError(error, "Error al obtener el producto"));
  }
};

export const crearProducto = async (req, res, next) => {
  try {
    const { nombre, descripcion, marca, categoria, precio, stock, imagenes } = req.body;

    if (!nombre || !precio || !stock || !categoria) {
      const error = new Error("Faltan campos obligatorios: nombre, precio, stock o categoría");
      error.status = 400;
      return next(error);
    }
    //Para evitar duplicados
    const nombreNormalizado = nombre.trim().toLowerCase();
    const marcaNormalizada = marca?.trim().toLowerCase();

    const categoriaExistente = await Categoria.findById(categoria);
    if (!categoriaExistente) {
      const error = new Error("La categoría indicada no existe");
      error.status = 404;
      return next(error);
    }

    const nuevoProducto = await Producto.create({
      nombre: nombreNormalizado,
      descripcion,
      marca: marcaNormalizada,
      categoria,
      precio,
      stock,
      imagenes
    });

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto: nuevoProducto
    });
  } catch (error) {
    next(manejarError(error, "Error al crear el producto"));
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, marca, categoria, precio, stock, imagenes } = req.body;

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { nombre, descripcion, marca, categoria, precio, stock, imagenes },
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      const error = new Error("Producto no encontrado para actualizar");
      error.status = 404;
      return next(error);
    }
    //Para que no envien algo vacio
    if (Object.keys(req.body).length === 0) {
      const error = new Error("Debe proporcionar al menos un campo para actualizar");
      error.status = 400;
      return next(error);
    }

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: productoActualizado
    });
  } catch (error) {
    next(manejarError(error, "Error al actualizar el producto"));
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      const error = new Error("Producto no encontrado para eliminar");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    next(manejarError(error, "Error al eliminar el producto"));
  }
};

