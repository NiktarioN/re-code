import { getAllSearchParams } from '../../../../../utils/url-utils';

const fillFormFieldsFromUrl = () => {
	const urlParams = getAllSearchParams(window.location.href);
	const formFields = {
		email: '[data-tilda-rule="email"]',
		phone: '[data-tilda-rule="phone"], [name="tildaspec-phone-part[]"]',
		name: '[data-tilda-rule="name"]',
	};

	Object.entries(formFields).forEach(([key, value]) => {
		const paramValue = urlParams.get(key);
		if (!paramValue) {
			return;
		}

		document.querySelectorAll(value).forEach((field) => {
			// eslint-disable-next-line no-param-reassign
			field.value = paramValue;
		});
	});
};

export default fillFormFieldsFromUrl;
