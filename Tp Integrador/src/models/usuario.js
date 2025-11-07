import mongoose from "mongoose";

const usuarioModel = mongoose.Schema(
    {
        nombre:{type: String, required: true},
        email:{type: String, required: true, unique: true, lowercase: true},
        password:{type: String, required: true},
        telefono:{type: String},
        rol: {
            type: String,
            enum: ["cliente", "admin"],
            default: "cliente"
        },
        direcciones:[
            {
                calle: {type: String},
                ciudad: {type: String},
                provincia: {type: String},
                pais: {type: String}
            }
        ]
    },
        {
            timestamps: true // Guardar hora y fecha al crearlo y editarlo
        }
);
export const Usuario = mongoose.model("Usuario", usuarioModel);