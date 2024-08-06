const addTargetBlankInLinks = () => {
	const nodes = document.querySelectorAll('.answer-content .title a, .answer-content .answer-main-content a');

	nodes.forEach((link) => link.setAttribute('target', '_blank'));
};

export default addTargetBlankInLinks;
