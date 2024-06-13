const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  crearUsuario,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/login");
const { loginUsuario } = require("../controllers/login");

const router = Router();

router.post(
  "/new",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe tener 6 caracteres").isLength({
      min: 6,
    }),
    check("dni", "El dni es obligatorio").isNumeric(),
    validarCampos,
  ],

  crearUsuario
);

router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe tener 6 caracteres").isLength({
      min: 6,
    }),
    check("dni", "El dni es obligatorio").isNumeric(),
    validarCampos,
  ],
  loginUsuario
);

router.get("/usuario", obtenerUsuario);
router.put("/usuario/:id", actualizarUsuario);
router.delete("/usuario/:id", eliminarUsuario);

module.exports = router;
