/* eslint-disable no-param-reassign */

import { currentUrl, getAllSearchParams } from '../../../../../utils/url-utils';

const fillFormFieldsFromUrl = () => {
	const urlParams = getAllSearchParams(currentUrl.href);
	const formFields = {
		email: '[name="formParams[email]"]',
		phone: '[name="formParams[phone]"]',
		name: '[name="formParams[full_name]"], [name="formParams[first_name]"]',
	};

	Object.entries(formFields).forEach(([key, value]) => {
		const paramValue = urlParams.get(key);
		if (!paramValue) {
			return;
		}

		document.querySelectorAll(value).forEach((field) => {
			field.value = paramValue;
		});
	});
};

export default fillFormFieldsFromUrl;
