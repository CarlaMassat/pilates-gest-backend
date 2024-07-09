const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const{dbConnection} = require('./database/config') 

const app = express();

dbConnection();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// rutas FALTAN RUTA OBTENER, ACTUALIZAR Y ELIMINAR
app.use('/api/login', require('./routes/login'));
app.use('/api/turno', require('./routes/turno'));
app.use('/api/horario', require('./routes/horario'));


app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
})