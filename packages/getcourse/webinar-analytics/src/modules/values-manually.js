import { currentUrl, getSearchParamValue } from '../../../utils/url-utils';
import getCookieValue from '../helpers/cookie-storage';

const setValueManually = (type) => {
	const targetClassName = `recode-${type}-`;

	const getTargetParamValue = (element) => {
		const targetClass = [...element.classList].find((className) => className.startsWith(targetClassName));

		return targetClass ? targetClass.match(new RegExp(`${targetClassName}(.+)`))[1] : null;
	};

	const getTypeValue = (element) => {
		switch (type) {
			case 'value':
				return getTargetParamValue(element);
			case 'param':
				return getSearchParamValue(currentUrl.href, getTargetParamValue(element));
			case 'cookie':
				return getCookieValue(getTargetParamValue(element));
			default:
				return null;
		}
	};

	const elements = [...document.querySelectorAll(`[class*="${targetClassName}"]`)].filter((element) =>
		[...element.classList].some((className) => className.startsWith(targetClassName))
	);

	elements.forEach((element) => {
		const targetValue = getTypeValue(element);
		if (!targetValue) {
			return;
		}

		const targetElement = element.querySelector('.form-control');
		if (!targetElement || !(targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			return;
		}
		targetElement.value = targetValue;
	});
};

export default setValueManually;
