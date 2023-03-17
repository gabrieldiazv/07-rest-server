const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearRegistroGeneral,
  obtenerRegistrosGenerales,
  obtenerRegistroById,
} = require("../controllers/registroGeneral");

const router = Router();

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

router.post("/", [validarJWT, validarCampos], crearRegistroGeneral);
router.get("/", [validarJWT, validarCampos], obtenerRegistrosGenerales);
router.get("/:id", [validarJWT, validarCampos], obtenerRegistroById);

module.exports = router;
