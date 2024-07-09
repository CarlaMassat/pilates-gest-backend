const { response } = require("express");
const Horario = require("../models/horario");


const crearHorario = async (req, res) => {
  try {
    const { dia, hora } = req.body;

    // Validar que el día sea de lunes a viernes
    const diasPermitidos = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
    if (!diasPermitidos.includes(dia)) {
      return res.status(400).json({ message: "El día debe ser de lunes a viernes" });
    }

    // Validar que la hora esté entre las 08:00 y las 20:00
    const horaFormat = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!horaFormat.test(hora)) {
      return res.status(400).json({ message: "La hora debe estar en formato HH:mm" });
    }

    const [hour] = hora.split(":").map(Number);
    if (hour < 8 || hour >= 20) {
      return res.status(400).json({ message: "La hora debe estar entre las 08:00 y las 20:00" });
    }

    // Contar cuántos horarios ya existen para el mismo día y hora
    const existingCount = await Horario.countDocuments({ dia, hora });

    if (existingCount >= 5) {
      return res.status(400).json({ message: "El horario ya está ocupado, no hay lugar disponible" });
    }

    // Crear el nuevo horario
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const mesActual = meses[fechaActual.getMonth()];
    const anioActual = fechaActual.getFullYear();
    const fechaFormateada = `${diaActual} de ${mesActual} de ${anioActual}`;

    const horario = new Horario({
      ...req.body,
      slot: existingCount + 1,
      estado: 'fijo',
      fechaFormateada: fechaFormateada,
    });

    // Marcar como ocupado si es necesario
    if (horario.slot >= 5) {
      horario.ocupado = true;
    }

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

    // Validar que el día sea de lunes a viernes
    const diasPermitidos = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
    if (!diasPermitidos.includes(dia)) {
      return res.status(400).json({ message: "El día debe ser de lunes a viernes" });
    }

    // Validar que la hora esté entre las 08:00 y las 20:00
    const horaFormat = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!horaFormat.test(hora)) {
      return res.status(400).json({ message: "La hora debe estar en formato HH:mm" });
    }

    const [horaNueva, minutosNueva] = hora.split(":").map(Number);
    if (horaNueva < 8 || horaNueva >= 20) {
      return res.status(400).json({ message: "La hora debe estar entre las 08:00 y las 20:00" });
    }

    // Obtener el horario original
    const horarioOriginal = await Horario.findById(id);
    if (!horarioOriginal) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    // Verificar que la reprogramación se haga con al menos 24 horas de anticipación
    const fechaActual = new Date();
    const [horaOriginal, minutosOriginal] = horarioOriginal.hora.split(":").map(Number);

    // Crear la fecha y hora del horario original
    const fechaHorarioOriginal = new Date();
    fechaHorarioOriginal.setHours(horaOriginal, minutosOriginal, 0, 0);

    // Crear la fecha y hora del nuevo horario
    const fechaNueva = new Date(fechaActual);
    fechaNueva.setHours(horaNueva, minutosNueva, 0, 0);

    // Obtener el próximo día para la nueva fecha, basándonos en el día de la semana proporcionado
    const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
    const diasDeLaSemana = [1, 2, 3, 4, 5]; // Lunes a Viernes
    const diaNuevaIndex = diasSemana.indexOf(dia);

    // Ajustar la fechaNueva para que esté en el día de la semana especificado
    const diasHastaNuevoDia = (diaNuevaIndex + 1 - fechaNueva.getDay() + 7) % 7;
    fechaNueva.setDate(fechaNueva.getDate() + diasHastaNuevoDia);

    // Calcular la diferencia en horas
    const diferenciaHoras = (fechaNueva - fechaActual) / (1000 * 60 * 60);

    if (diferenciaHoras < 24) {
      return res.status(400).json({ message: "La reprogramación debe hacerse con al menos 24 horas de anticipación" });
    }

    // Contar cuántos horarios ya existen para el mismo día y hora (excluyendo el actual)
    const existingCount = await Horario.countDocuments({ dia, hora, _id: { $ne: id } });

    if (existingCount >= 5) {
      return res.status(400).json({ message: "El horario ya está ocupado, no hay lugar disponible" });
    }

    // Calcular la nueva fecha formateada basándose en el día y la hora proporcionados
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    const fechaBase = new Date();
    fechaBase.setDate(fechaBase.getDate() + diasHastaNuevoDia);
    fechaBase.setHours(horaNueva, minutosNueva, 0, 0);

    const fechaFormateada = `${fechaBase.getDate()} de ${meses[fechaBase.getMonth()]} de ${fechaBase.getFullYear()}`;

    // Actualizar el horario
    horarioOriginal.dia = dia;
    horarioOriginal.hora = hora;
    horarioOriginal.fechaFormateada = fechaFormateada;
    horarioOriginal.estado = 'fijo'; 

    // Marcar como ocupado si es necesario
    horarioOriginal.ocupado = existingCount + 1 >= 5;

    await horarioOriginal.save();

    res.status(200).json(horarioOriginal);
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
