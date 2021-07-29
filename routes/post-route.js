const { check } = require('express-validator');
const { Router } = require('express');
const {
	postCreate,
	postGet,
	postDelete,
} = require('../controllers/post-controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-roles');
const { postExist } = require('../helpers/db-validator');

const router = Router();

router.get('/', postGet);

router.post(
	'/',
	[
		validarJWT,
		validarRol,
		check('content_es', 'El contenido en español es obligatorio').notEmpty(),
		check('content_en', 'El contenido en ingles es obligatorio').notEmpty(),
		validarCampos,
	],
	postCreate
);

router.delete(
	'/:id',
	[
		validarJWT,
		validarRol,
		check('id', 'No es un ID Valido').isMongoId(),
		check('id').custom(postExist),
		validarCampos,
	],
	postDelete
);

module.exports = router;
