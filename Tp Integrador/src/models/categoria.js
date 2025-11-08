import mongoose from 'mongoose';

const CategoriaModel = mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

export const Categoria = mongoose.model('Categoria', CategoriaModel);