const { Schema, model } = require("mongoose");

const registroGeneralSchema = Schema({
  titulo: {
    type: String,
    required: [true, "titulo es obligatorio"],
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

module.exports = model("RegistroGeneral", registroGeneralSchema);
