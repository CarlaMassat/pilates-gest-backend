const { Router } = require("express");
const router = Router();

const {
    crearHorario,
    obtenerHorario,
    actualizarHorario,
    eliminarHorario,
} = require('../controllers/horario');

router.post("/", crearHorario);
router.get("/", obtenerHorario);
router.put("/:id", actualizarHorario);
router.delete("/:id", eliminarHorario);
module.exports = router;