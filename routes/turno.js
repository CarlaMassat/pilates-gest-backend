const { Router } = require("express");
const router = Router();

const {
  crearTurno,
  obtenerTurno,
  obtenerTurnoAlumno,
  reprogramarTurnoAlumno,
  eliminarTurnoAlumno,
} = require("../controllers/turno");

router.post("/", crearTurno);
router.get("/", obtenerTurno);
router.put("/:turnoId", reprogramarTurnoAlumno);
router.delete("/:turnoId", eliminarTurnoAlumno);
module.exports = router;
