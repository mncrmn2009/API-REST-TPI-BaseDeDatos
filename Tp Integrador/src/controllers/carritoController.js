import { Carrito } from "../models/carrito.js";
import { Producto } from "../models/producto.js";
import { manejarError } from "../utils/manejarError.js";

export const obtenerCarrito = async (req, res) => {
    try {
        const {usuarioId} = req.params;
        const carrito = await Carrito.findOne({ usuario: usuarioId }).populate('productos.producto');

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }
        res.status(200).json({success: true, data: carrito});
    } catch (error) {
        next(manejarError(error, "Error al obtener el carrito"));
    }
};

export const agregarAlCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { productoId, cantidad } = req.body;

        const producto = await Producto.findById(productoId);
       if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

       let carrito = await Carrito.findOne({ usuario: usuarioId });

       if (!carrito) {
           carrito = new Carrito({ usuario: usuarioId, productos: [] });
       }

       //verificar si el producto ya está agregado al carrito

       const itemExistente = carrito.productos.find((item) => item.producto.toString() === productoId);

         if (itemExistente) {
            itemExistente.cantidad += cantidad; //aumenta el producto que ya esté en el carro
            } else {
            carrito.productos.push({ producto: productoId, cantidad }); //agrega un nuevo producto al carrito
            }

            await carrito.save();
            res.status(200).json({ success: true, data: carrito });
    } catch (error) {
        next(manejarError(error, "Error al agregar producto al carrito"));
    }  
};

export const EliminarDelCarrito = async (req, res) => {
    try {
        const {usuarioId, productoId} = req.params;

        const carrito = await Carrito.findOneAndUpdate({ usuario: usuarioId },
            {$pull: { productos: { producto: productoId } } }, 
            { new: true }
        ).populate('productos.producto', "nombre precio");

        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ success: true, data: carrito });
    } catch (error) {
        next(manejarError(error, "Error al eliminar el producto del carrito"));
    }
};

export const VaciarCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const carrito = await Carrito.findOneAndUpdate(
            { usuario: usuarioId },
            { $set: { productos: [] } },
            { new: true }
        );
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ success: true, data: carrito });
    } catch (error) {
        next(manejarError(error, "Error al vaciar el carrito"));
    }
};

export const totalCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const carrito = await Carrito.findOne({ usuario: usuarioId }).populate('productos.producto');
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const total = carrito.productos.reduce((acc, item) => {
            return acc + item.producto.precio * item.cantidad;
        }, 0);
        res.status(200).json({ success: true, total });
    } catch (error) {
        next(manejarError(error, "Error al calcular el total del carrito"));
    }  
};

