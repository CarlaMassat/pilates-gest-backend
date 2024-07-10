const { Router } = require("express");
const router = Router();

const {
    crearHorario,
    obtenerHorario,
    obtenerHorarioLibre,
    actualizarHorario,
    eliminarHorario,
} = require('../controllers/horario');

router.post("/", crearHorario);
router.get("/", obtenerHorario);
router.get("/libre",obtenerHorarioLibre)
router.put("/:id", actualizarHorario);
router.delete("/:id", eliminarHorario);
module.exports = router;