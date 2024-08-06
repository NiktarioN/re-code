import { currentUrl, getSearchParamValue } from '../../../../utils/url-utils';
import getCookieValue from '../helpers/cookie-storage';

const setValueManually = (type) => {
	const targetClassName = `recode-${type}-`;

	const getTargetParamValue = (element) => {
		const targetClass = [...element.classList].find((className) => className.startsWith(targetClassName));

		return targetClass ? targetClass.match(new RegExp(`${targetClassName}([^\\s]+)`))[1] : null;
	};

	const getTypeValue = (element) => {
		switch (type) {
			case 'value':
			case 'text':
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
		let targetValue = getTypeValue(element);
		if (!targetValue) {
			return;
		}

		if (type === 'text') {
			targetValue = targetValue.replace(/[-_]/g, ' ');
		}

		const targetElements = element.querySelectorAll('.custom-field-value, .form-control');
		targetElements.forEach((targetElement) => {
			if (!targetElement.tagName === 'INPUT' || !targetElement.tagName === 'TEXTAREA') {
				return;
			}

			// eslint-disable-next-line no-param-reassign
			targetElement.value = targetValue;
		});
	});
};

export default setValueManually;
