const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  //  si el Middleware pasa: (si llegaste a este punto sigue con el otro middleware)
  next();
};

module.exports = {
  validarCampos,
};
