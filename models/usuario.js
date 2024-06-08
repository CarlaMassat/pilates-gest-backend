const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

// las mismas propiedades deben coincidir en el front cuando se definen
const UsuarioSchema = Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  password: String,
  dni: Number,
  fechaNacimiento: String,
  telefono: Number,
  turno:String,
  rol: String,
  fechaIngreso: {
    type: Date,
    default: () => moment().utc().subtract(3, 'hours').toDate()
  }

});


module.exports = mongoose.model('Usuario', UsuarioSchema);