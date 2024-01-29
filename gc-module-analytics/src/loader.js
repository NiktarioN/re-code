const script = document.createElement('script');
script.dataset.scriptName = 'Модуль аналитики на GetCourse';
script.dataset.author = 're-code studio (tg: @recode_solutions)';
script.src = `https://tech-borodach.pro/projects/web/gc-module-analytics/index.js?v=${new Date()
	.getTime()
	.toString()
	.slice(0, 10)}`;

document.body.appendChild(script);
