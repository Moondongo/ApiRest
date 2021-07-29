const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = Schema({
	user: {
		type: String,
		required: [true, 'el usuario es obligatorio'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'la contraseña es obligatoria'],
	},
	role: {
		type: String,
		required: true,
		default: 'USER_ROLE',
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
	},
	status: {
		type: Boolean,
		default: true,
	},
});

UserSchema.methods.toJSON = function () {
	const { __v, password, ...user } = this.toObject();
	return user;
};

UserSchema.methods.encryptPassword = async (password) => {
	const salt = await bcryptjs.genSalt(10);
	return await bcryptjs.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
	return await bcryptjs.compare(password, this.password);
};

module.exports = model('User', UserSchema);
