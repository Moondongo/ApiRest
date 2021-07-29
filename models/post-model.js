const { model, Schema } = require('mongoose');

const PostSchema = Schema({
	content_es: {
		type: String,
		required: true,
	},
	content_en: {
		type: String,
		required: true,
	},
	img: {
		type: [String],
	},
	video: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: Boolean,
		default: true,
	},
});

module.exports = model('post', PostSchema);
