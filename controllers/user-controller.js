const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user-model');

const userCreate = async (req = request, res = response) => {
	const { user, password } = req.body;
	const usuario = new User({ user });

	//Encriptar la contraseña
	usuario.password = await usuario.encryptPassword(password);

	//Guardamos en base de datos
	await usuario.save();

	res.json(usuario);
};

module.exports = {
	userCreate,
};
