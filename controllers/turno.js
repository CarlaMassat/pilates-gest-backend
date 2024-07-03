const { response } = require("express");
const Turno = require("../models/turno");

const crearTurno = async (req, res = response) => {
  const turno = new Turno(req.body);
  try {
    const turnoGuardar = await turno.save();
    res.status(201).json({
      ok: true,
      turno: turnoGuardar,
    });
  } catch (error) {
    res.status(500).json({
      msg: "por favor hable con el administrador",
    });
  }
};

const obtenerTurno = async (req, res = response) => {
  const turnos = await Turno.find();

  res.json({
    turnos,
  });
};

const reprogramarTurnoAlumno = async (req, res = response) => {
  const turnoId = req.params.id;

  try {
    const turno = await Turno.findById(turnoId);

    if (!turno) {
      return res.status(404).json({
        ok: false,
        msg: "no existe el turno",
      });
    }

    const nuevoTurno = {
      ...req.body,
    };

    const turnoActualizar = await Turno.findByIdAndUpdate(turnoId, nuevoTurno, {
      new: true,
    });
    res.json({
      ok: true,
      turno: turnoActualizar,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "por favor hable con el administrador",
    });
  }
};

const eliminarTurnoAlumno = async (req, res = response) => {
  const turnoId = req.params.id;

  try {
    const turno = await Turno.findById(turnoId);

    if (!turno) {
      return res.status(404).json({
        ok: false,
        msg: "no existe turno",
      });
    }

    await Turno.findByIdAndDelete(turnoId);
    res.json({
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "por favor hable con el administrador",
    });
  }
};

module.exports = {
  crearTurno,
  obtenerTurno,
  reprogramarTurnoAlumno,
  eliminarTurnoAlumno,
};
