const { Router } = require('express');
const { check } = require('express-validator');
const { login, renovarToken } = require('../controllers/auth-controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [validarJWT, validarRol], renovarToken);

router.post(
	'/login',
	[
		check('user', 'El Email es obligatorio').notEmpty(),
		check('password', 'La Contraseña es obligatorio').not().isEmpty(),
		validarCampos,
	],
	login
);

module.exports = router;
