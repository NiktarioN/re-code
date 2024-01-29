const customPay = (form) => {
  const targetClassName = ['recode-custom-pay-value-', 'recode-custom-pay-%-'];

  const getTargetParamValue = (element) => {
		const targetClass = [...element.classList].find((className) => className.startsWith(targetClassName));

		return targetClass ? targetClass.match(new RegExp(`${targetClassName}(.+)`))[1] : null;
	};

  const hasFuncClass = form.
};

export default customPay;