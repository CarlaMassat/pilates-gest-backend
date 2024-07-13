const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HorarioSchema = Schema({
  dia: String,
  hora: String,
  slot: {
    type: Number,
    default: 0,
    max: 5,
  },
  ocupado: Boolean,
  // fechaFormateada: String,
  estado: {
    type: String,
    enum: ["fijo", "libre", "libre temporario"],
  },
});

module.exports = mongoose.model("Horario", HorarioSchema);
