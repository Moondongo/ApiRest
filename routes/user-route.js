const { check } = require('express-validator');
const { Router } = require('express');
const { userCreate } = require('../controllers/user-controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { userExist } = require('../helpers/db-validator');

const router = Router();

router.post(
	'/',
	[
		check('password', 'la contraseña es obligatoria').notEmpty(),
		check('user', 'el usuario es obligatorio').notEmpty(),
		check('user').custom(userExist),
		validarCampos,
	],
	userCreate
);

module.exports = router;
