const { response, request } = require("express");

const RegistroMedico = require("../models/registroMedico");

// post registro medico
const postRegistroMedico = async (req = request, res = response) => {
  const { nombre, apellidoPaterno, apellidoMaterno, rut, descripcion, fotos } =
    req.body;
  const idUsuario = req.usuario.id;

  try {
    const registroMedico = new RegistroMedico({
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rut,
      descripcion,
      fotos,
      idUsuario,
    });

    await registroMedico.save();

    res.status(201).json({
      ok: true,
      msg: "Registro medico creado",
      registroMedico,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};


module.exports = {
    postRegistroMedico,
};