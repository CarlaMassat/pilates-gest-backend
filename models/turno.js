const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const turnoSchema = Schema({
  diaFijo: String,
  horaFija: String,
  hora: String,
  pack: String,
  tipoActividad: String,
  disponibilidad: String,
  diaSemana: String,
  alumnos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  ],
});

module.exports = mongoose.model("Turno", turnoSchema);
