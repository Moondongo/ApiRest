const { request, response } = require('express');
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarImagenes = async (req = request, res = response) => {
	const img = [];
	const archivos = req.files.archivos;

	if (Array.isArray(archivos)) {
		for (let archivo of archivos) {
			const { tempFilePath } = archivo;
			try {
				const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
				img.push(secure_url);
			} catch (err) {
				res.status(400).json(e);
			}
		}
	} else {
		const { tempFilePath } = archivos;
		try {
			const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
			img.push(secure_url);
		} catch (err) {
			res.status(400).json(e);
		}
	}

	res.status(201).json({ img });
};

module.exports = {
	cargarImagenes,
};
