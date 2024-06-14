const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

const crearUsuario = async (req, res = response) => {
  const { nombre, apellido, email, password, dni } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        msg: "El usuario ya existe",
        ok: false,
      });
    }

    usuario = new Usuario(req.body);
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();

    res.status(201).json({
      ok: true,
      msg: "usuario creado",
      nombre: nombre,
      apellido,
      email,
      password,
      dni,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "por favor hable con el administrador",
    });
  }
};

const obtenerUsuario = async (req, res = response) => {
  const alumnos = await Usuario.find(req.query);
  res.json({
    ok: true,
    msg: alumnos,
  });
};

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

    const nuevoAlumno = {
      ...req.body,
    };

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

const loginUsuario = async (req, res = response) => {
  const { email, password, dni } = req.body;
  try {
    const usuario = await Usuario.findOne({ email, dni });
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
      msg: "login exitoso",
      nombre: usuario.nombre,
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
