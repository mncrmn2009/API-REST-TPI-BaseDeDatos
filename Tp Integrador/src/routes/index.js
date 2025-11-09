import usuarioRoutes from "./usuarioRoutes.js";
import authRoutes from "./authRoutes.js";
import categoriaRoutes from "./categoriaRoutes.js";
import productoRoutes from "./productoRoutes.js";
import resenaRoutes from "./resenaRoutes.js";
import carritoRoutes from "./carritoRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";
import analisisRoutes from "./analisisRoutes.js";

export default function configurarRutas(app) {
  app.use("/api/usuarios", usuarioRoutes);
  app.use("/api", authRoutes);
  app.use("/api/categorias", categoriaRoutes);
  app.use("/api/productos", productoRoutes);
  app.use("/api/resenas", resenaRoutes);
  app.use("/api/carrito", carritoRoutes);
  app.use("/api/pedidos", pedidoRoutes);
  app.use("/api/analisis", analisisRoutes);
}
