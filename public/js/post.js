const $postContainer = document.querySelector('.container-post');
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

// const buttons = () => {
// 	document.querySelectorAll('.post-view').forEach((card) => {
// 		//!Slider
// 		const children = card.lastElementChild.children;
// 		let position = 0;
// 		const totalImg = Number(card.lastElementChild.children[0].textContent);
// 		if (totalImg < 1) {
// 			card.lastElementChild.children[0].textContent = '';
// 			card.lastElementChild.children[0].classList.remove('counter-item');
// 		} else {
// 			children[0].textContent = `1/${totalImg}`;
// 		}

// 		card.addEventListener('click', async (e) => {
// 			//!Deleted
// 			if (e.target.classList.contains('deleted')) {
// 				e.target.disabled = true;
// 				const id = e.target.value;
// 				await fetch(url + `api/post/${id}`, {
// 					method: 'DELETE',
// 					headers: { 'x-token': token },
// 				})
// 					.then((resp) => resp.json())
// 					.then((resp) => {
// 						const { errors, msg } = resp;
// 						if (errors || msg) {
// 							console.log({ errors, msg });
// 							e.target.disabled = false;
// 						} else {
// 							card.remove();
// 						}
// 					});
// 			}

// 			//!Slider
// 			//* CLICK NEXT
// 			if (e.target.classList.contains('next')) {
// 				position === totalImg - 1 ? (position = 0) : position++;
// 				updateSlide(children, position, totalImg);
// 			}
// 			//* CLICK PREV
// 			else if (e.target.classList.contains('prev')) {
// 				position === 0 ? (position = totalImg - 1) : position--;
// 				updateSlide(children, position, totalImg);
// 			}
// 		});
// 	});
// };
// const updateSlide = (slides, position, totalImg) => {
// 	slides[0].textContent = `${position + 1}/${totalImg}`;
// 	for (const slide of slides) {
// 		slide.classList.remove('carousel_item--visible');
// 	}
// 	slides[position + 1].classList.add('carousel_item--visible');
// };

const rezizeIMG = (url = '') => {
	const toReplace = url.split('/')[6];
	const modificador = 'w_500,f_auto,q_80/';
	return url.replace(toReplace, modificador);
};
const insertarCards = (post) => {
	let countCarouselActions = 0;
	const $fragment = document.createDocumentFragment();

	for (let element in post) {
		const data = post[element];
		const totalItem = data.img.length + (data.video ? 1 : 0);
		const $postView = document.createElement('div');
		$postView.classList.add('post-view');
		const $content = document.createElement('div');
		$content.classList.add('content');
		const $slider = document.createElement('div');
		$slider.classList.add('carousel');

		$postView.innerHTML = `
			<button value='${data._id}' class='deleted'>BORRAR</button>
		`;

		$content.innerHTML = `
			<span>${new Date(data.date).toLocaleDateString()}</span>
			<p>${data.content_es}</p>
		`;

		if (totalItem > 1) {
			$slider.innerHTML += `<span class="counter-item">1/${totalItem}</span>`;
		}
		if (data.video) {
			$slider.innerHTML += `
				<div class="carousel_item carousel_item--visible">
					<iframe
						width='350'
						height='200'
						src='https://www.youtube.com/embed/${data.video}'
						title='YouTube video player'
						frameborder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowfullscreen
						loading="lazy"
					></iframe>
				</div>
			`;
			for (const img of data.img) {
				$slider.innerHTML += `
					<div class="carousel_item">
						<a href="${img}" target="_blank">
							<img
								class="img"
								src="${rezizeIMG(img)}"
								loading="lazy"
							/>
						</a>
					</div>
				`;
			}
		} else {
			for (const i in data.img) {
				if (i == 0) {
					$slider.innerHTML += `
					<div class="carousel_item carousel_item--visible">
						<a href="${data.img[i]}" target="_blank">
							<img
								class="img"
								src="${rezizeIMG(data.img[i])}"
							/>
						</a>
					</div>
				`;
				} else {
					$slider.innerHTML += `
					<div class="carousel_item">
						<a href="${data.img[i]}" target="_blank">
							<img
								class="img"
								src="${rezizeIMG(data.img[i])}"
								loading="lazy"
							/>
						</a>
					</div>
				`;
				}
			}
		}

		if (data.img.length > 1 || (data.img.length > 0 && data.video)) {
			$slider.innerHTML += `
				<div class="carousel_actions" data-id="${countCarouselActions}" data-pos="0" data-total="${totalItem}">
					<button id="prev" aria-label="Previous Slide" class="prev">
						<i class="fas fa-angle-double-left"></i>
					</button>
					<button id="next" aria-label="Next Slide" class="next">
						<i class="fas fa-angle-double-right"></i>
					</button>
				</div>
			`;
			countCarouselActions++;
		}
		$postView.appendChild($content);
		$postView.appendChild($slider);
		$fragment.appendChild($postView);
	}
	$postContainer.appendChild($fragment);
};

const eventPost = () => {
	$postContainer.addEventListener('click', async (e) => {
		if (e.target.matches('.deleted')) {
			await deletePost(e);
		}
		if (e.target.parentElement.matches('.carousel_actions')) {
			changeImg(e);
		}
	});
};
const deletePost = async (e) => {
	e.target.disabled = true;
	idPost = e.target.value;

	await fetch(url + `api/post/${idPost}`, {
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
				e.target.parentElement.remove();
			}
		});
};
const changeImg = (e) => {
	const actions = e.target.parentElement;
	const carousel = actions.parentElement;
	let position = Number(actions.getAttribute('data-pos'));
	const totalImg = Number(actions.getAttribute('data-total'));

	if (e.target.matches('.next')) {
		position === totalImg - 1
			? actions.setAttribute('data-pos', 0)
			: actions.setAttribute('data-pos', position + 1);
	} else if (e.target.matches('.prev')) {
		position === 0
			? actions.setAttribute('data-pos', totalImg - 1)
			: actions.setAttribute('data-pos', position - 1);
	}
	position = Number(actions.getAttribute('data-pos'));

	carousel.children[0].textContent = `${position + 1}/${totalImg}`;
	for (const element of carousel.children) {
		element.classList.remove('carousel_item--visible');
	}
	carousel.children[position + 1].classList.add('carousel_item--visible');
};
const main = async () => {
	await validarJWT();

	try {
		const { total, post } = await fetch(url + 'api/post?limite=0').then(
			(resp) => resp.json()
		);

		insertarCards(post.reverse());
		//buttons();
		eventPost();
	} catch (error) {
		console.log(error);
	}
};

main();

document.querySelector('.logout').addEventListener('click', () => {
	localStorage.removeItem('token');
	window.location = url + 'login';
});
