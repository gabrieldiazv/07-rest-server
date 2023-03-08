const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  cambiarPassword,
  usuariosAllGet,
  searchBy,
} = require("../controllers/usuarios.controller");

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

const router = Router();
router.get("/", usuariosAllGet);
router.get("/searchBy", [[validarJWT], validarCampos], searchBy);
router.post(
  "/",
  [
    [validarJWT],
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellidoPaterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("apellidoMaterno", "El apellido materno es obligatorio")
      .not()
      .isEmpty(),
    check("rut", "El rut es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password es obligatorio y debe tener mas de 6 letras"
    ).isLength({ min: 6 }),
    check("correo").custom((correo) => emailExiste(correo)),
    // check("rol").custom((rol) => esRoleValido(rol)), // se puede obviar el parametro rol dejando solo esRoleValido
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("correo", "El correo no es valido").isEmail(),
    validarCampos,
  ],
  usuariosPost
);
router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    // check("correo").custom((correo) => emailExiste(correo)),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellidoPaterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("apellidoMaterno", "El apellido materno es obligatorio")
      .not()
      .isEmpty(),
    check("rut", "El rut es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  usuariosPut
);
router.delete(
  "/:id",
  [
    validarJWT,
    // check("id", "No es un ID valido").isMongoId(),
    // check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.put(
  "/cambiarPassword/:id",
  [
    validarJWT,
    check("passwordNueva", "la passwordNueva es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  cambiarPassword
);

module.exports = router;
