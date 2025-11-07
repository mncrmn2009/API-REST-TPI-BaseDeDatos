import express from "express";
import { conexionDB } from "./config/database.js"
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

conexionDB();

//Parsear los cuerpos de las peticiones
app.use(express.json());

//Rutas
app.use ("/api/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
    res.send("Servidor y base de datos funcionando");
})

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
  });
});

app.listen(PORT, () => {
    console.log ("Servidor escuchando...");
});