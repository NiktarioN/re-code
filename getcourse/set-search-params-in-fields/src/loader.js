const addScript = () => {
	const script = document.createElement('script');
	script.dataset.scriptName = 'Установка значений параметров из URL в поля формы';
	script.dataset.author = 're-code studio (tg: @recode_solutions)';
	script.src = `https://tech-borodach.pro/packages/getcourse/set-search-params-in-fields/index.js?v=${new Date()
		.getTime()
		.toString()
		.slice(0, 10)}`;

	document.body.appendChild(script);
};

document.addEventListener('DOMContentLoaded', () => {
	addScript();
});
