const { response } = require("express");
const Horario = require("../models/horario");

const crearHorario = async (req, res) => {
  try {
    const { dia, hora } = req.body;

    const diasPermitidos = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
    ];
    if (!diasPermitidos.includes(dia)) {
      return res
        .status(400)
        .json({ message: "El día debe ser de lunes a viernes" });
    }

    const horaFormat = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!horaFormat.test(hora)) {
      return res
        .status(400)
        .json({ message: "La hora debe estar en formato HH:mm" });
    }

    const [hour] = hora.split(":").map(Number);
    if (hour < 8 || hour >= 21) {
      return res
        .status(400)
        .json({ message: "La hora debe estar entre las 08:00 y las 20:00" });
    }

    const existingCount = await Horario.countDocuments({ dia, hora });

    if (existingCount >= 5) {
      return res.status(400).json({
        message: "El horario ya está ocupado, no hay lugar disponible",
      });
    }

    const horario = new Horario({
      ...req.body,
      slot: existingCount + 1,
      estado: "fijo",
    });

    horario.ocupado = existingCount + 1 >= 5;

    await horario.save();

    res.status(201).json(horario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obtenerHorario = async (req, res = response) => {
  const horarios = await Horario.find();
  res.json({
    horarios,
  });
};

const actualizarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia, hora } = req.body;

    const diasPermitidos = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
    ];
    if (!diasPermitidos.includes(dia)) {
      return res
        .status(400)
        .json({ message: "El día debe ser de lunes a viernes" });
    }

    const horaFormat = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!horaFormat.test(hora)) {
      return res
        .status(400)
        .json({ message: "La hora debe estar en formato HH:mm" });
    }

    const [hour] = hora.split(":").map(Number);
    if (hour < 8 || hour >= 21) {
      return res
        .status(400)
        .json({ message: "La hora debe estar entre las 08:00 y las 20:00" });
    }

    const horarioOriginal = await Horario.findById(id);
    if (!horarioOriginal) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    const diaAnterior = horarioOriginal.dia;
    const horaAnterior = horarioOriginal.hora;

    const existingCount = await Horario.countDocuments({ dia, hora });
    if (
      existingCount >= 5 &&
      !(horarioOriginal.dia === dia && horarioOriginal.hora === hora)
    ) {
      return res
        .status(400)
        .json({
          message: "El horario ya está ocupado, no hay lugar disponible",
        });
    }

    horarioOriginal.dia = dia;
    horarioOriginal.hora = hora;
    await horarioOriginal.save();

    const horariosAnteriores = await Horario.find({
      dia: diaAnterior,
      hora: horaAnterior,
    }).sort("slot");
    for (let i = 0; i < horariosAnteriores.length; i++) {
      horariosAnteriores[i].slot = i + 1;
      await horariosAnteriores[i].save();
    }

    const horariosNuevos = await Horario.find({ dia, hora }).sort("slot");
    for (let i = 0; i < horariosNuevos.length; i++) {
      horariosNuevos[i].slot = i + 1;
      await horariosNuevos[i].save();
    }

    res.status(200).json({
      message: "Horario actualizado con éxito",
      horarioOriginalReemplazado: {
        dia: diaAnterior,
        hora: horaAnterior,
        estado: horarioOriginal.estado,
      },
      horarioActualizado: horarioOriginal,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const eliminarHorario = async (req, res) => {
  try {
    const { id } = req.params;

    const horarioEliminado = await Horario.findByIdAndDelete(id);

    if (!horarioEliminado) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    res.status(200).json({ message: "Horario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  crearHorario,
  obtenerHorario,
  actualizarHorario,
  eliminarHorario,
};
