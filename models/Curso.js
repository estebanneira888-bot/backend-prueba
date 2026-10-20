/**
 * @typedef {Object} Curso
 * @property {string} codigo - Codigo del curso (unico).
 * @property {string} nombre - Nombre del curso.
 * @property {number} duracion - Duracion en horas.
 * @property {number} status - 0 = activo, 1 = inactivo.
 * @property {Date} createdAt - Fecha de creacion.
 * @property {Date} updatedAt - Fecha de ultima actualizacion.
 */
import { Schema, model } from "mongoose";

const CursoSchema = new Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    duracion: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1],
    },
  },
  {
    timestamps: true,
  }
);

export default model("Curso", CursoSchema);
