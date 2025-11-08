import mongoose from 'mongoose';

const carritoProductoModel = mongoose.Schema({
    producto: {type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true},
    cantidad: {type: Number, default: 1, default: 1},
    addedAt: {type: Date, default: Date.now}},{_id: false});

const CarritoModel = mongoose.Schema({
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true},
    productos: [carritoProductoModel]
},{
    timestamps: true,
    versionKey: false
});

export const Carrito = mongoose.model('Carrito', CarritoModel);