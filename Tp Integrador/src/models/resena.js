import mongoose from "mongoose";

const ResenaModel = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    calificacion: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comentario: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Para que un usuario no reseñe 2 veces el producto
ResenaModel.index({ usuario: 1, producto: 1 }, { unique: true });

export const Resena = mongoose.model("Reseña", ResenaModel);
