import mongoose from "mongoose";

const itemPedidoModel = new mongoose.Schema(
  {
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    cantidad: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  },
  { _id: false }
);

const pedidoModel = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    items: [itemPedidoModel],
    total: { type: Number, required: true },
    metodoPago: { type: String, enum: ["efectivo", "tarjeta", "transferencia"], required: true },
    estado: { type: String, enum: ["pendiente", "procesando", "enviado", "entregado", "cancelado"], default: "pendiente" },
    fecha: { type: Date, default: Date.now }
  },
  { timestamps: true, versionKey: false }
);

export const Pedido = mongoose.model("Pedido", pedidoModel);
