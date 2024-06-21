const { response } = require("express");
const Turno = require("../models/turno");
const moment = require("moment");
moment.locale("es");

const crearTurno = async (req, res = response) => {
  const turno = new Turno(req.body);
  try {
    const turnoGuardar = await turno.save();

    const turnoConAlumnos = await Turno.findById(turnoGuardar._id).populate(
      "alumnos",
      "nombre apellido"
    );
    res.status(201).json({
      evento: turnoConAlumnos,
    });
  } catch (error) {
    res.status(500).json({
      msg: "por favor hable con el administrador",
    });
  }
};

const obtenerTurno = async (req, res = response) => {
  const turnos = await Turno.find().populate([
    {
      path: "alumnos",
      model: "Usuario",
      select: "nombre apellido rol",
    },
  ]);
  res.json({
    turnos,
  });
};

const reprogramarTurnoAlumno = async (req, res = response) => {
  const { turnoId } = req.params;
  const { diaNuevo, horaNueva, diaFijo, horaFija } = req.body;
  const ahora = moment();
  const fechaTurno = moment(diaNuevo + " " + horaNueva, "YYYY-MM-DD HH:mm");
  const diferenciaHoras = fechaTurno.diff(ahora, "hours");

  if (diferenciaHoras < 24) {
    return res.status(400).json({
      msg: "Solo se pueden reprogramar turnos con al menos 24 horas de antelación.",
    });
  }

  if (fechaTurno.day() === 0 || fechaTurno.day() === 6) {
    return res.status(400).json({
      msg: "No se pueden reprogramar turnos para sábado o domingo.",
    });
  }

  try {
    const diaSemana = fechaTurno.format("dddd");
    const turnoActualizado = await Turno.findByIdAndUpdate(
      turnoId,
      {
        diaFijo: diaFijo,
        horaFija: horaFija,
        dia: diaNuevo,
        hora: horaNueva,
        diaSemana: diaSemana,
      },
      { new: true }
    ).populate({
      path: "alumnos",
      select: "nombre",
    });

    if (!turnoActualizado) {
      return res.status(404).json({
        msg: "No se encontró el turno a reprogramar.",
      });
    }

    res.json({
      turno: turnoActualizado,
      msg: "Turno reprogramado exitosamente.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al reprogramar el turno. Por favor, contacte con el administrador.",
    });
  }
};

const eliminarTurnoAlumno = async (req, res = response) => {
  const { turnoId } = req.params;

  try {
    const turnoEliminado = await Turno.findByIdAndDelete(turnoId);

    if (!turnoEliminado) {
      return res.status(404).json({
        msg: "No se encontró el turno a eliminar.",
      });
    }

    res.json({
      msg: "Turno eliminado correctamente.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al eliminar el turno. Por favor, contacte con el administrador.",
    });
  }
};

module.exports = {
  crearTurno,
  obtenerTurno,
  reprogramarTurnoAlumno,
  eliminarTurnoAlumno,
};
