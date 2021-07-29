const { request, response } = require('express');

const webLogin = (req = request, res = response) => {
	res.render('signin', {
		title: 'Sign In',
	});
};

module.exports = {
	webLogin,
};
