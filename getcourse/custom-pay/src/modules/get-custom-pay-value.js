const getCustomPayValue = (selectedNode) => {
  const targetNode = selectedNode.closest('.custom-pay, .recode-custom-pay');
  const targetClass = [...targetNode.classList].find((className) =>
    className.startsWith('custom-pay-value') || className.startsWith('recode-custom-pay-value')
  );
  const customPayValue = targetClass.match(/\d+/);

  return customPayValue[0];
};

export default getCustomPayValue;