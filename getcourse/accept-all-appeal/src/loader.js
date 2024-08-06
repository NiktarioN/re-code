const script = document.createElement('script');
script.dataset.scriptName = 'Закрытие обращений на GetCourse';
script.dataset.author = 're-code studio (tg: @recode_solutions)';
script.src = `https://tech-borodach.pro/packages/getcourse/accept-all-appeal/index.js?v=${new Date()
	.getTime()
	.toString()
	.slice(0, 10)}`;

document.body.appendChild(script);
