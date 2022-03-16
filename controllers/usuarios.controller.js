const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  // const { nombre = "no nombre", apikey, page = 1, limit = 10 } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  // const usuarios = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite));

  // const total = await Usuario.countDocuments(query);

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, password, rol, correo });

  // verificar si el correo existente

  // Encriptar la contrasena
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);
  // guardar en bd
  await usuario.save();
  res.json({
    msg: "post API - controlador",
    usuario,
  });
};

const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, ...resto } = req.body;

  // TODO validar contra BD
  if (password) {
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    msg: "put API - controlador",
    id,
  });
};

const usuariosPatch = (req, res) => {
  res.json({
    msg: "patch API - controlador",
  });
};

const usuariosDelete = async (req, res) => {
  const { id } = req.params;
  // const uid = req.uid;
  const usuarioAutenticado = req.usuario;
  
  // Fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({ usuario, usuarioAutenticado });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
