const url = window.location.hostname.includes('localhost')
	? 'http://localhost:8081/'
	: 'https://domediscover-api.herokuapp.com/';
const token = localStorage.getItem('token') || '';
//Validar el token del localstorage
const validarJWT = async () => {
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

const insertarCards = (post) => {
	for (let element in post) {
		const data = post[element];

		const postView = document.createElement('div');
		postView.classList.add('post-view');
		const content = document.createElement('div');
		content.classList.add('content');
		const slider = document.createElement('ul');
		slider.classList.add('slider');
		const menu = document.createElement('ul');
		menu.classList.add('menu');

		postView.innerHTML = `
			<button value='${data._id}' class='deleted'>BORRAR</button>
		`;

		content.innerHTML = `
			<span>${new Date(data.date).toLocaleDateString()}</span>
			<p>${data.content_es}</p>
		`;

		if (data.video) {
			slider.innerHTML = `
				<li id='${data.video}'>
					<iframe
						width='350'
						height='200'
						src='https://www.youtube.com/embed/${data.video}'
						title='YouTube video player'
						frameborder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowfullscreen
					></iframe>
				</li>
			`;
			menu.innerHTML = `
				<li>
					<a href='#${data.video}' target="_top" ></a>
				</li>
			`;
		}
		for (const img of data.img) {
			const nombreArray = img.split('/');
			const nombreArchivo = nombreArray[nombreArray.length - 1];
			const [public_id] = nombreArchivo.split('.');

			slider.innerHTML += `
				<li id='${public_id}'>
					<img src='${img}'/>
				</li>
			`;
			menu.innerHTML += `
				<li>
					<a href='#${public_id}'></a>
				</li>
			`;
		}

		postView.appendChild(content);
		postView.appendChild(slider);
		postView.appendChild(menu);
		document.querySelector('.container-post').appendChild(postView);
	}
};

const main = async () => {
	await validarJWT();

	try {
		const { total, post } = await fetch(url + 'api/post?limite=0').then(
			(resp) => resp.json()
		);

		insertarCards(post);
		const $card = document.querySelectorAll('.post-view');
		$card.forEach((card) => {
			card.addEventListener('click', async (e) => {
				if (e.target.nodeName === 'BUTTON') {
					e.target.disabled = true;
					const id = e.target.value;
					await fetch(url + `api/post/${id}`, {
						method: 'DELETE',
						headers: { 'x-token': token },
					})
						.then((resp) => resp.json())
						.then((resp) => {
							const { errors, msg } = resp;
							if (errors || msg) {
								console.log({ errors, msg });
								e.target.disabled = false;
							} else {
								card.remove();
							}
						});
				}
			});
		});
	} catch (error) {
		console.log(error);
	}
};

main();

document.querySelector('.logout').addEventListener('click', () => {
	localStorage.removeItem('token');
	window.location = url + 'login';
});
