const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require("../models/usuario");

const login = async (req, res = response) => {
  try {
    let { correo, password } = req.body;
    // verificar si el email existente
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "ussuario / password no son correctos - correo",
      });
    }
    //  si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        ok: false,
        msg: "ussuario / password no son correctos - estado:false",
      });
    }
    // verificar la contrasena de
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "usuario / password no son correctos - password",
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);
    let { _doc } = usuario;
    let { password: pass, ...resto } = _doc;

    res.json({
      ok: true,
      usuario: resto,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const muestrame = async (req, res = response) => {
  const bearerHeader = req.headers["authorization"];
  // console.log(bearerHeader);
  if (!bearerHeader) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }
  try {
    const token = bearerHeader.split(" ")[1];
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    // Leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res
        .status(404)
        .json({ msg: "Token no valido - usuario no existe en db" });
    }

    // Verificar si el uid tiene estado true
    if (!usuario.estado) {
      return res
        .status(401)
        .json({ msg: "Token no valido - usuario con estado false" });
    }

    let { _doc, ...resto } = usuario;
    console.log(_doc);
    let {
      rol,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rut,
      correo,
      estado,
      _id,
    } = _doc;

    res.json({
      scope: [rol],
      rol,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rut,
      correo,
      estado,
      _id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error interno hable con el administrador",
    });
  }
};

// funcion que resfresh el token
const renewToken = async (req, res = response) => {
  const { uid } = req;
  // Generar un nuevo JWT
  const token = await generarJWT(uid);
  // Obtener el usuario por UID
  const usuario = await Usuario.findById(uid);
  res.json({
    ok: true,
    usuario,
    token,
  });
};

module.exports = {
  login,
  muestrame,
};
