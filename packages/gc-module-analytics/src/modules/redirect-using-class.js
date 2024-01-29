import { redirectModesOptions, redirectToUrl } from '../helpers/helpers';
import { currentUrl, getAllSearchParams, addSearchParams } from '../../../utils/url-utils';

const redirectUsingClass = () => {
	const nodeSelector = '.recode-transfer-params';

	document.querySelectorAll(nodeSelector).forEach((node) => {
		const button = node.querySelector('button');
		const script = node.querySelector('script');
		if (!button || !script) {
			return;
		}

		const match = script.innerHTML.match(
			/(?:location\.href\s*=\s*['"]([^'"]+)['"]|window\.open\s*\(\s*['"]([^'"]+)['"])/
		);
		if (!match) {
			return;
		}

		const redirectProperties = {
			method: match[1] ? redirectModesOptions['location.href'] : redirectModesOptions['window.open'],
			value: match[1] || match[2] || '',
		};

		const buttonNew = button.cloneNode(true);
		button.parentNode.replaceChild(buttonNew, button);

		buttonNew.addEventListener('click', (event) => {
			event.preventDefault();

			redirectToUrl(
				addSearchParams(redirectProperties.value, [...getAllSearchParams(currentUrl.href)]).href,
				redirectProperties.method
			);
		});
	});
};

export default redirectUsingClass;
