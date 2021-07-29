const mongoose = require('mongoose');

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CNN, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});

		console.log('Base De Dato Online');
	} catch (error) {
		console.log(error);
		throw new Error('Error Al levantar Base de Datos');
	}
};

module.exports = dbConnection;
