import mongoose from "mongoose";
import { manejarError } from "../utils/manejarError.js";

export const analisisResenas = async (req, res, next) => {
  try {
    const resultados = await mongoose.connection.collection("reseñas").aggregate([
      // Unir reseñas con productos
      {
        $lookup: {
          from: "productos",            // nombre de la colección
          localField: "producto",       // campo en reseñas (ObjectId)
          foreignField: "_id",          // campo en productos
          as: "producto_info"
        }
      },

      // Desanidar el array producto_info
      { $unwind: "$producto_info" },

      // Agrupar por producto
      {
        $group: {
          _id: "$producto_info._id",
          nombreProducto: { $first: "$producto_info.nombre" },
          cantidadResenas: { $sum: 1 },
          promedioCalificacion: { $avg: "$calificacion" }
        }
      },

      // Ordenar por promedio descendente
      { $sort: { promedioCalificacion: -1 } },

      // Proyectar el formato final
      {
        $project: {
          _id: 0,
          nombreProducto: 1,
          cantidadResenas: 1,
          promedioCalificacion: { $round: ["$promedioCalificacion", 2] }
        }
      }
    ]).toArray();

    // Calcular total de productos analizados
    const total = resultados.length;

    res.status(200).json({
      totalProductosAnalizados: total,
      resultados
    });
  } catch (error) {
    next(manejarError(error, "Error al ejecutar análisis de reseñas"));
  }
};

