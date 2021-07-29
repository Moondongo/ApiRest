const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const borrarImg = async (post) => {
	for (let img of post.img) {
		const nombreArray = img.split('/');
		const nombreArchivo = nombreArray[nombreArray.length - 1];
		const [public_id] = nombreArchivo.split('.');
		cloudinary.uploader.destroy(public_id);
	}
};

module.exports = borrarImg;
