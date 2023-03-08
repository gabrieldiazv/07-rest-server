const { Schema, model } = require("mongoose");

const registroMedicoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "nombre es obligatorio"],
  },
  apellidoPaterno: {
    type: String,
    required: [true, "apellido es obligatorio"],
  },
  apellidoMaterno: {
    type: String,
    required: [true, "apellido es obligatorio"],
  },
  rut: {
    type: String,
    required: [true, "rut es obligatorio"],
  },
  descripcion: {
    type: String,
    required: [true, "descripcion es obligatorio"],
  },
  fotos: {
    type: [String],
  },
  idUsuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
});

module.exports = model("RegistroMedico", registroMedicoSchema);
