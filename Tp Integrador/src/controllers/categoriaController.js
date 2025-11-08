import { Categoria } from "../models/categoria.js";
import { manejarError } from "../utils/manejarError.js";

export const listarCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.find();

    if (!categorias || categorias.length === 0) {
      return res.status(204).json({ mensaje: "No hay categorías registradas" });
    }

    res.status(200).json(categorias);
  } catch (error) {
    next(manejarError(error, "Error al obtener las categorias"));
  }
};

export const obtenerCategoriaPorId = async (req, res, next) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      const error = new Error("Categoría no encontrada");
      error.status = 404;
      return next(error);
    }

    res.status(200).json(categoria);
  } catch (error) {
    next(manejarError(error, "Error al buscar la categoria"));
  }
};

export const crearCategoria = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      const error = new Error("El nombre de la categoría es obligatorio");
      error.status = 400;
      return next(error);
    }

    const categoriaExistente = await Categoria.findOne({ nombre });
    if (categoriaExistente) {
      const error = new Error("Ya existe una categoría con ese nombre");
      error.status = 409;
      return next(error);
    }

    const nuevaCategoria = await Categoria.create({ nombre, descripcion });
    res
      .status(201)
      .json({ mensaje: "Categoría creada correctamente", categoria: nuevaCategoria });
  } catch (error) {
    next(manejarError(error, "Error al crear la categoria"));
  }
};


export const actualizarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true, runValidators: true }
    );

    if (!categoriaActualizada) {
      const error = new Error("Categoría no encontrada para actualizar");
      error.status = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ mensaje: "Categoría actualizada correctamente", categoria: categoriaActualizada });
  } catch (error) {
    next(manejarError(error, "Error al actualizar la categoria"));
  }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);

    if (!categoriaEliminada) {
      const error = new Error("Categoría no encontrada para eliminar");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    next(manejarError(error, "Error al eliminar la categoria"));
  }
};
