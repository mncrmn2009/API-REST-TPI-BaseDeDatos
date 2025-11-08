import express from 'express';
import{
    obtenerCarrito,
    agregarAlCarrito,
    EliminarDelCarrito,
    VaciarCarrito,
    totalCarrito
} from"../controllers/carritoController.js";

const router = express.Router();

router.get('/:usuarioId', obtenerCarrito);//Obtener el carrito de un usuario

router.post('/:usuarioId/agregar', agregarAlCarrito);//Agregar un producto al carrito

router.delete('/:usuarioId/producto/:productoId', EliminarDelCarrito);//Eliminar un producto

router.delete('/:usuarioId/vaciar', VaciarCarrito);//Vaciar todo el carrito

router.get('/:usuarioId/total', totalCarrito);//Calcula el total del carrito

export default router;