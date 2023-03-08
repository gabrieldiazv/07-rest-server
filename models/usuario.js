const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "nombre es obligatorio"],
  },
  apellidoPaterno: {
    type: String,
    required: [true, "apellido es obligatorio"]
  },
  apellidoMaterno: {
    type: String,
    required: [true, "apellido es obligatorio"]
  },
  rut:{
    type: String,
    required: [true, "rut es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password es obligatoria"],
  },
  rol: {
    type: String,
    required: [true, "rol es obligatorio"],
    enum: ["ADMIN", "MEDICO", ""],
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

UsuarioSchema.index({'$**': 'text'});

module.exports = model("Usuario", UsuarioSchema);
