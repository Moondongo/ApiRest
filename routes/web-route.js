const { Router } = require('express');
const { webLogin } = require('../controllers/web-controller');

const router = Router();

router.get('/post', (req, res) => {
	res.render('post');
});

router.get('/', (req, res) => {
	res.render('home');
});

router.get('/login', webLogin);

module.exports = router;
