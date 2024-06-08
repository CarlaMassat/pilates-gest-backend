const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

// 2° desestructuro metodos e importo las controladoras
const {
  crearUsuario,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/login");
const { loginUsuario } = require("../controllers/login");

const router = Router();

// rutas usuario
router.post(
  "/new",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("dni", "El dni es obligatorio").isNumeric(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe tener 6 caracteres").isLength({
      min: 6,
    }),
    check("fechaNacimiento", "La fecha de nacimiento").not().isEmpty(),
    check("telefono").isNumeric(),
    check("turno").not().isEmpty(),

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

    validarCampos,
  ],
  loginUsuario
);


router.get("/usuario", obtenerUsuario);
router.put("/usuario/:id", actualizarUsuario);
router.delete("/usuario/:id", eliminarUsuario);

module.exports = router;
