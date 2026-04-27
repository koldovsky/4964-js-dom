const h1 = document.querySelector('.header__title');

const greetings = [
	'Привіт!',
	'Вітаю!',
	'Доброго дня!',
	'Слава Україні!',
	'Радий тебе бачити!',
	'Гарного настрою!'
];

const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
const randomColor = `#${Math.floor(Math.random() * 16777215)
	.toString(16)
	.padStart(6, '0')}`;


h1.innerText = randomGreeting;
h1.style.color = randomColor;
