const addStyles = () => {
	const link = document.createElement('link');
	link.dataset.scriptName = 'Плагин для GetCourse';
	link.dataset.author = 're-code studio (tg: @recode_solutions)';
	link.rel = 'stylesheet';
	link.href = `https://tech-borodach.pro/packages/getcourse/plugin/index.css?v=${new Date()
		.getTime()
		.toString()
		.slice(0, 10)}`;

	document.body.appendChild(link);
};

const addScript = () => {
	const script = document.createElement('script');
	script.dataset.scriptName = 'Плагин для GetCourse';
	script.dataset.author = 're-code studio (tg: @recode_solutions)';
	script.src = `https://tech-borodach.pro/packages/getcourse/plugin/index.js?v=${new Date()
		.getTime()
		.toString()
		.slice(0, 10)}`;

	document.body.appendChild(script);
};

if (document.body) {
	addStyles();
}

document.addEventListener('DOMContentLoaded', () => {
	addStyles();
	addScript();
});
