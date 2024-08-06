const resetFieldValue = () => {
	const targetSelector = '.recode-reset-value';

	const nodes = document.querySelectorAll(`${targetSelector} input, ${targetSelector} textarea`);
	nodes.forEach(($node) => {
		const node = $node;
		node.value = '';
	});
};

export default resetFieldValue;
