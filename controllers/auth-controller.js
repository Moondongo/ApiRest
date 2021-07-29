const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user-model');
const { generarJWT } = require('../helpers/generarJWT');

const login = async (req, res = response) => {
	const { user, password } = req.body;

	try {
		//Verificar si el email existe
		const usuario = await User.findOne({ user });
		if (!usuario) {
			return res.status(400).json({
				msg: 'Usuario o contraseña incorrecto',
			});
		}

		//Si el usuario esta activo
		if (!usuario.status) {
			return res.status(400).json({
				msg: 'Usuario dado de baja',
			});
		}

		//Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				msg: 'Usuario o contraseña incorrecto',
			});
		}

		//Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Hable con el administrador',
		});
	}
};

const renovarToken = async (req, res = response) => {
	const { usuario } = req;

	//Generar el JWT
	const token = await generarJWT(usuario.id);

	res.json({
		usuario,
		token,
	});
};

module.exports = {
	login,
	renovarToken,
};
