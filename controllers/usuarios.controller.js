const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosAllGet = async (req, res = response) => {
  try {
    const { limite = 5, desde = 0, campo = null, orden = null } = req.query;

    const query = { estado: true };
    let sort = {};

    if (campo != "undefined") {
      sort[campo] = orden;
    }

    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query, { password: 0 })
        .collation({ locale: "es", strength: 2 })
        .sort(sort)
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({
      total,
      usuarios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error,
    });
  }
};

const searchBy = async (req, res) => {
  try {
    let { limite = 5, desde = 0, search = "" } = req.query;

    let regex = new RegExp(search, "i");

    let query = {
      $or: [
        { nombre: regex },
        { apellidoMaterno: regex },
        { apellidoPaterno: regex },
        { rut: regex },
        { correo: regex },
        { rol: regex },
      ],
      estado: true,
    };

    console.log(query);

    let [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
    ]);

    res.json({
      ok: true,
      total,
      usuarios,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error interno consulte al adminsitrador",
      error,
    });
  }
};

const usuariosPost = async (req, res = response) => {
  try {
    const { usuario: usuarioCreador } = req;
    console.log(usuarioCreador);
    let {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rut,
      correo,
      password,
      rol,
    } = req.body;
    // verificar si el correo existente
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }
    const usuario = new Usuario({
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rut,
      password,
      rol,
      correo,
    });
    // Encriptar la contrasena
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);
    // guardar en bd
    await usuario.save();
    res.json({
      ok: true,
      msg: "usuario creado con exito",
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const usuariosPut = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, password, correo, ...resto } = req.body;

    await Usuario.findByIdAndUpdate(id, resto);

    res.json({
      ok: true,
      msg: "usuario actualizado con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error consulte con el administrador",
    });
  }
};

const cambiarPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { passwordNueva } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(id);
    // actualizar password del usuario id con la passwordNueva
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(passwordNueva, salt);
    await usuario.save();
    res.status(200).json({
      ok: true,
      msg: "password actualizada con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error,
    });
  }
};

const usuariosDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    return res.json({
      ok: true,
      msg: "usuario eliminado con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error consulte con el administrador",
    });
  }
};

module.exports = {
  usuariosAllGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  cambiarPassword,
  searchBy
};
