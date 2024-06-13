const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const UsuarioSchema = Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  password: String,
  dni: Number,
  fechaIngreso: {
    type: Date,
    default: () => moment().utc().subtract(3, "hours").toDate(),
  },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
