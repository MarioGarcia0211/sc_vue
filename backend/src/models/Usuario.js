import { Schema, model } from "mongoose";

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    clave: {
      type: String,
      required: true,
      trim: true,
    },
    tipoDocumento: {
      type: String,
      required: true,
      trim: true,
    },
    numeroDocumento: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    rol: {
      type: String,
      enum: ["Administrador", "Profesor", "Estudiante"],
      default: "Estudiante",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Usuario = model("Usuario", usuarioSchema);
