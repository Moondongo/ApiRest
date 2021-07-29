const User = require('../models/user-model');
const Post = require('../models/post-model');

const userExist = async (user) => {
	const userAlreadyExists = await User.findOne({ user });

	if (userAlreadyExists) {
		throw new Error(`el usuario ${user} no esta disponible para su uso`);
	}
};

const postExist = async (post) => {
	const postAlreadyExists = await Post.findById(post);

	if (!postAlreadyExists) {
		throw new Error(`No Existe Post con esta ID ${post}`);
	}
};

module.exports = {
	userExist,
	postExist,
};
