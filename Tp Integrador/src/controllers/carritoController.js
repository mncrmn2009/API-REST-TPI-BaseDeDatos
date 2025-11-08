import { Carrito } from "../models/carrito";
import { Producto } from "../models/producto";

export const obtenerCarrito = async (req, res) => {
    try {
        const {usuarioId} = req.params;
        const carrito = await Carrito.findOne({ usuario: usuarioId }).populate('productos.producto');

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }
        res.status(200).json({success: true, dara: carrito});
    } catch (error) {
        res.status(500).json({  success: false, error: error.message });
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

       const ItemExistente = carrito.item.find((item) => item.producto.toString() === productoId);

         if (ItemExistente) {
            itemExistente.cantidad += cantidad; //aumenta el producto que ya esté en el carro
            } else {
            carrito.productos.push({ producto: productoId, cantidad }); //agrega un nuevo producto al carrito
            }

            await carrito.save();
            res.status(200).json({ success: true, data: carrito });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }  
};

export const EliminarDelCarrito = async (req, res) => {
    try {
        const {usuarioId, productoId} = req.params;

        const carrito = await Carrito.findOne({ usuario: usuarioId },
            {$pull: { productos: { producto: productoId } } }, 
            { new: true }
        ).populate('productos.producto', "nombre precio");

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        res.status(200).json({ success: true, data: carrito });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        res.status(200).json({ success: true, data: carrito });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const totalCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const carrito = await Carrito.findOne({ usuario: usuarioId }).populate('productos.producto');
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }
        const total = carrito.productos.reduce((acc, item) => {
            return acc + item.producto.precio * item.cantidad;
        }, 0);
        res.status(200).json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }  
};

