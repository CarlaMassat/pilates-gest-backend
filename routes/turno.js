const { Router } = require("express");
const router = Router();

const {
  crearTurno,
  obtenerTurno,
  reprogramarTurnoAlumno,
  eliminarTurnoAlumno,
} = require("../controllers/turno");

router.post("/", crearTurno);
router.get("/", obtenerTurno);
router.put("/:id", reprogramarTurnoAlumno);
router.delete("/:id", eliminarTurnoAlumno);
module.exports = router;
