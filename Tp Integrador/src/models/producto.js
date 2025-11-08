import mongoose from 'mongoose';

const ProductoModel = mongoose.Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String},
    brand:{type: String},
    category:{type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true},
    precio:{type: Number, required: true},
    stock:{type: Number, required: true},
    imagenes:[String],
    reviewCount:{type: Number, default: 0},
    avgRating:{type: Number, default: 0}
},{
    timestamps: true,
    versionKey: false
});

// Índice de texto para búsqueda por nombre, descripción y marca en una sola consulta

ProductoSchema.index({ nombre: "text", descripcion: "text", brand: "text" });

export const Producto = mongoose.model('Producto', ProductoModel);