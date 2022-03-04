const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
  const { nombre = "no nombre", apikey, page = 1, limit = 10 } = req.query;
  res.json({
    msg: "get API - Controlador",
    nombre,
    apikey,
    page,
    limit,
  });
};

const usuariosPost = (req, res = response) => {
  const { nombre, edad } = req.body;
  res.json({
    msg: "post API - controlador",
    nombre,
    edad,
  });
};

const usuariosPut = (req, res) => {
  const { id } = req.params;
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

const usuariosDelete = (req, res) => {
  res.json({
    msg: "delete API -controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
