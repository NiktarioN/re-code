const script = document.createElement('script');
script.dataset.scriptName = 'Права для сотрудников на GetCourse';
script.dataset.author = 're-code studio (tg: @recode_solutions)';
script.src = `https://tech-borodach.pro/packages/getcourse/employees-assignments/index.js?v=${new Date()
	.getTime()
	.toString()
	.slice(0, 10)}`;

document.body.appendChild(script);
