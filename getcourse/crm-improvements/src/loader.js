const addStyles = () => {
	const link = document.createElement('link');
	link.dataset.scriptName = 'Улучшение CRM GetCourse';
	link.dataset.author = 're-code studio (tg: @recode_solutions)';
	link.rel = 'stylesheet';
	link.href = `https://tech-borodach.pro/packages/getcourse/crm-improvements/style.css?v=${new Date()
		.getTime()
		.toString()
		.slice(0, 10)}`;

	document.body.appendChild(link);
};
addStyles();

const addScript = () => {
	const script = document.createElement('script');
	script.dataset.scriptName = 'Улучшение CRM GetCourse';
	script.dataset.author = 're-code studio (tg: @recode_solutions)';
	script.src = `https://tech-borodach.pro/packages/getcourse/crm-improvements/index.js?v=${new Date()
		.getTime()
		.toString()
		.slice(0, 10)}`;

	document.body.appendChild(script);
};
addScript();
