const url = window.location.hostname.includes('localhost')
	? 'http://localhost:8081/'
	: 'https://domediscover-api.herokuapp.com/';
const error = sessionStorage.getItem('error');
let usuario = null;

//Validar el token del localstorage
const validarJWT = async () => {
	const token = localStorage.getItem('token') || '';
	if (token.length <= 10) {
		window.location = url + 'login';
		throw new Error('No hay token en el servidor');
	}

	const resp = await fetch(url + 'api/auth', {
		headers: { 'x-token': token },
	});

	const { usuario: usuarioDB, token: tokenDB, msg } = await resp.json();
	if (msg) {
		window.location = url + 'login';
		return sessionStorage.setItem('error', msg);
	}
	usuario = usuarioDB;
	localStorage.setItem('token', tokenDB);
};

const main = async () => {
	await validarJWT();

	const $form = document.querySelector('form');

	$form.addEventListener('submit', async (e) => {
		e.preventDefault();
		document.querySelector('.post button').textContent = 'Espere un momento...';
		document.querySelector('.post button').disabled = true;

		const token = localStorage.getItem('token') || '';
		const data = {};

		//Cargamos las imagenes
		const archivos = document.getElementById('file').files;
		if (archivos.length > 0) {
			const formData = new FormData();
			for (let archivo of archivos) {
				formData.append('archivos', archivo);
			}
			await fetch(url + 'api/upload', {
				method: 'POST',
				body: formData,
			})
				.then((resp) => resp.json())
				.then((resp) => {
					data.img = resp.img;
				})
				.catch(console.log);
		}
		//obtenemos los datos del formulario
		for (let element of $form.elements) {
			if (element.name.length > 0 && element.name != 'archivos') {
				data[element.name] = element.value;
			}
		}

		await fetch(url + 'api/post', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json', 'x-token': token },
		})
			.then((resp) => resp.json())
			.then(({ msg, ...post }) => {
				if (msg) {
					return sessionStorage.setItem('error', msg);
				}

				document.querySelector('.post button').disabled = false;
				document.querySelector('.post button').textContent = 'Publicar';
				console.log(post);
			})
			.catch((err) => {
				console.log(err);
			});
		$form.reset();
	});
};

main();
//leo los errores guardados en sessionStorage
if (error) {
	console.log(error);

	sessionStorage.removeItem('error');
}

document.querySelector('.logout').addEventListener('click', () => {
	localStorage.removeItem('token');
	window.location = url + 'login';
});
