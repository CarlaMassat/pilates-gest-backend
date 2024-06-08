const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

//crear usuario
const crearUsuario = async (req, res = response) => {
  const {
    nombre,
    apellido,
    dni,
    email,
    password,
    fechaNacimiento,
    telefono,
    turno,
    rol,
  } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        msg: "El usuario ya existe",
        ok: false,
      });
    }

    usuario = new Usuario(req.body);
    //encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();

    res.status(201).json({
      ok: true,
      //   uid: usuario.id,
      msg: "usuario creado",
      nombre: nombre.usuario,
      apellido,
      dni,
      email,
      password,
      fechaNacimiento,
      telefono,
      turno,
      rol,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "por favor hable con el administrador",
    });
  }
};

// obtener usuario rol alumno
const obtenerUsuario = async (req, res = response) => {
  const alumnos = await Usuario.find(req.query);
  res.json({
    ok: true,
    msg: alumnos,
  });
};

//actualizar usuario rol alumno
const actualizarUsuario = async (req, res = response) => {
  const alumnoId = req.params.id;

  try {
    const alumno = await Usuario.findById(alumnoId);

    if (!alumno) {
      return res.status(404).json({
        ok: false,
        msg: "no existe alumno con ese id",
      });
    }

    //creacion nuevo alumno
    const nuevoAlumno = {
      ...req.body,
    };

    //actualizacion nuevo alumno
    const alumnoActualizado = await Usuario.findByIdAndUpdate(
      alumnoId,
      nuevoAlumno,
      { new: true }
    );
    res.json({
      ok: true,
      evento: alumnoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "por favor hable con el administrador",
    });
  }
};

// eliminar usuario rol alumno
const eliminarUsuario = async (req, res = response) => {
  const alumnoId = req.params.id;

  try {
    const alumno = await Usuario.findById(alumnoId);

    if (!alumno) {
      return res.status(404).json({
        ok: false,
        msg: "no existe alumno con ese id",
      });
    }

    await Usuario.findByIdAndDelete(alumnoId);
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

// login usuario
const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    res.json({
      ok: true,
   
      msg: "login",
      nombre: usuario.nombre,
      rol: usuario.rol,
     
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "por favor hable con el administrador",
    });
  }
};

module.exports = {
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  crearUsuario,
  loginUsuario,
};
