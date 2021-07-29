const express = require('express');
const exphbs = require('express-handlebars');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const dbConnection = require('../database/config');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		this.conectarDB();

		this.handlebars();

		this.paths = {
			auth: '/api/auth',
			home: '/',
			post: '/api/post',
			upload: '/api/upload',
			user: '/api/user',
		};

		this.middlewares();
		this.routes();
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		this.app.use(cookieParser());

		//Cors
		this.app.use(cors());

		//Passport
		require('../middlewares/passport');

		//Lectura y Parseo del body
		this.app.use(express.urlencoded({ extended: true })); //necesario para recibir datos de un form
		this.app.use(express.json());

		//Directorio Publico
		this.app.use(express.static('public'));

		//Carga de archivos
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: '/tmp/',
			})
		);
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth-route'));
		this.app.use(this.paths.post, require('../routes/post-route'));
		this.app.use(this.paths.user, require('../routes/user-route'));
		this.app.use(this.paths.upload, require('../routes/upload-route'));
		this.app.use(this.paths.home, require('../routes/web-route'));
	}

	handlebars() {
		// this.app.engine('.hbs', exphbs({ extname: '.hbs' }));
		// this.app.set('view engine', '.hbs');

		const hbs = exphbs.create({
			extname: '.hbs',
			partialsDir: './views/partials',
		});

		this.app.engine('.hbs', hbs.engine);
		this.app.set('view engine', '.hbs');
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Escuchando en el puerto ${this.port}`);
		});
	}
}

module.exports = Server;
