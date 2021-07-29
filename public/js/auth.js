const $form = document.querySelector('form');
const error = sessionStorage.getItem('error');

const url = window.location.hostname.includes('localhost')
	? 'http://localhost:8081/'
	: 'https://domediscover-api.herokuapp.com/';

$form.addEventListener('submit', (e) => {
	e.preventDefault();
	document.querySelector('.login button').disabled = true;
	document.querySelector('.error').classList.remove('active');
	const data = {};

	//obtenemos los datos del formulario
	for (let element of $form.elements) {
		if (element.name.length > 0) {
			data[element.name] = element.value;
		}
	}
	fetch(url + 'api/auth/login', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	})
		.then((resp) => resp.json())
		.then(({ msg, token }) => {
			if (msg) {
				document.querySelector('.login button').disabled = false;
				document.querySelector('.error').textContent = msg;
				document.querySelector('.error').classList.add('active');
				return;
			}

			localStorage.setItem('token', token);
			window.location = url;
		})
		.catch((err) => {
			console.log(err);
		});
});

//leo los errores guardados en sessionStorage
if (error) {
	document.querySelector('.error').textContent = error;
	document.querySelector('.error').classList.add('active');

	sessionStorage.removeItem('error');
}
