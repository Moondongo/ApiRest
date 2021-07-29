const { Router } = require('express');
const { cargarImagenes } = require('../controllers/upload-controller');
const { validarArchivoSubido } = require('../middlewares/validar-files');
const router = Router();

router.post('/', validarArchivoSubido, cargarImagenes);

module.exports = router;
