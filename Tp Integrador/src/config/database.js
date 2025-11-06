import mongoose from "mongoose";
import dotenv from "dotenv";

//Cargar las variables del .env
dotenv.config();

//Funcion para conectarse a Mongo
export const conexionDB = async ()=>{
    try{
        //Conectar usando la URI
        await mongoose.connect(process.env.MONGO_URI,{dbName: process.env.DB_NAME});

        console.log("Conexion con exito");
    }catch (error){
        console.error("Error al conectar", error.message);
        //Detener si falla
        process.exit(1);
    }
}