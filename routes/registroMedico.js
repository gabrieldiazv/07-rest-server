const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  postRegistroMedico,
} = require("../controllers/registroMedico.controller");

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellidoPaterno", "El apellido es obligatorio").not().isEmpty(),
    check("apellidoMaterno", "El apellido es obligatorio").not().isEmpty(),
    check("rut", "El rut es obligatorio").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  postRegistroMedico
);

module.exports = router;
