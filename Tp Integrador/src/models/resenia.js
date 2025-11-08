import mongoose from "mongoose";
import { Usuario } from "./usuario";

const ReseniaModel = mongoose.Schema({
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
    producto: {type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true},
    calificacion: {type: Number, required: true, min: 1, max: 5},
    comentario: {type: String},
},{
    timestamps: true,
    versionKey: false
});

//Permite que un usuario pueda dejar multiples reseñas

ReseniaModel.index({ usuario: 1, producto: 1 }, { unique: false });

export const Resenia = mongoose.model("Resenia", ReseniaModel);