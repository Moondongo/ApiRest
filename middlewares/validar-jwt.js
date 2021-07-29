const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			msg: 'no hay token en la peticion',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

		const usuario = await User.findById(uid);

		if (!usuario) {
			return res.status(401).json({
				msg: 'El Usuario no existe',
			});
		}

		//verificar si el usuario esta dado de baja
		if (!usuario.status) {
			return res.status(401).json({
				msg: 'El Usuario esta dado de baja',
			});
		}

		req.usuario = usuario;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: 'La Sesion Expiro',
		});
	}
};

module.exports = {
	validarJWT,
};
