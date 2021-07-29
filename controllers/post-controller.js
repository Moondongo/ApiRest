const { request, response } = require('express');
const borrarImg = require('../helpers/borrar-img');
const Post = require('../models/post-model');

const postGet = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const [total, post] = await Promise.all([
		Post.countDocuments(),
		Post.find().skip(Number(desde)).limit(Number(limite)),
	]);

	res.json({
		total,
		post,
	});
};

const postCreate = async (req = request, res = response) => {
	const { content_es, content_en, img, video } = req.body;
	const data = {
		content_es,
		content_en,
		img,
		video,
	};

	const post = new Post(data);

	await post.save();

	res.status(201).json(post);
};

const postDelete = async (req = request, res = response) => {
	const { id } = req.params;

	const post = await Post.findByIdAndDelete(id);

	borrarImg(post);

	res.json(post);
};

module.exports = {
	postGet,
	postCreate,
	postDelete,
};
