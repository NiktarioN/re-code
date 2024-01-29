const getCustomPayValue = (selectedNode) => {
	const targetNode = selectedNode.closest('.custom-pay');
	const targetClass = [...targetNode.classList].find((className) => className.startsWith('custom-pay-value'));
	const customPayValue = targetClass.match(/\d+/);

	return customPayValue[0];
};

export default getCustomPayValue;
