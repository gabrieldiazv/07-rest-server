const { Router } = require("express");
const { check } = require("express-validator");

const { login, muestrame } = require("../controllers/auth.controller");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();
router.post(
  "/login",
  [
    check("correo", "el correo es obligatorio").isEmail(),
    check("password", "la password es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.get("/muestrame", muestrame);

module.exports = router;
