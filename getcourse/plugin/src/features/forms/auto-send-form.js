import { hasSearchParam } from '../../../../../utils/url-utils';

const autoSendForm = () => {
	const hasSendFormParam = hasSearchParam(window.location.href, 'autosendform');
	if (!hasSendFormParam) {
		return;
	}

	const form = document.querySelector('form.lt-form');
	const button = form.querySelector('button[type="submit"]');
	if (!form || !button) {
		return;
	}

	button.click();
};

export default autoSendForm;
