const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const turnoSchema = Schema({
  nombre:String,
  apellido:String,
  diaFijo: String,
  horaFija: String,
  pack: String,
  fijo: String,
  tipoActividad: String,
  disponibilidad: String,
  rol: String
});

module.exports = mongoose.model("Turno", turnoSchema);
