const validarArchivoSubido = (req, res, next) => {
	if (
		!req.files ||
		Object.keys(req.files).length === 0 ||
		!req.files.archivos
	) {
		return res.status(400).json({ msg: 'No hay Archivos en la peticion' });
	}
	next();
};

module.exports = {
	validarArchivoSubido,
};
