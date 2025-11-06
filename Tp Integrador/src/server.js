import express from "express";
import { conexionDB } from "./config/database.js"
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

conexionDB();

//Parsear los cuerpos de las peticiones
app.use(express.json());

//ruta de prueba
app.get("/",(req,res)=>{
    res.send("Servidor funcionando");
});
//levantar el servidor
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});