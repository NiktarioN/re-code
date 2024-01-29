// TODO
// 1. Добавить параметры-исключения, когда не нужно обнулять значение поля, если этого поля нет

import { valueSetAttribute } from '../config/constants';
import { currentUrl, getSearchParamValue } from '../../../utils/url-utils';
import {
	referrerUrl,
	dealCreatedType,
	widgetUrl,
	getCurrentDate,
	getCurrentPageUrl,
} from '../helpers/get-analytic-data';
import getCookieValue from '../helpers/cookie-storage';

const getMethodValue = (type) => {
	switch (type) {
		case 'referrer':
			return referrerUrl;
		case 'url_full':
			return getCurrentPageUrl('full');
		case 'url_clean':
			return getCurrentPageUrl('clean');
		case 'created_date':
			return getCurrentDate();
		case 'created_type':
			return dealCreatedType;
		case 'widget_url':
			return widgetUrl;
		default:
			return null;
	}
};

const getTypeValue = (type, trigger) => {
	switch (type) {
		case 'param':
			return getSearchParamValue(currentUrl.href, trigger);
		case 'cookie':
			return getCookieValue(trigger);
		case 'other':
			return getMethodValue(trigger);
		default:
			return null;
	}
};

const setValuesInFields = (fields) => {
	const setValue = () => {
		fields.forEach(({ fieldSelector, valueType, trigger }) => {
			document.querySelectorAll(`${fieldSelector}:not([${valueSetAttribute}])`).forEach(($field) => {
				const field = $field;
				field.value = getTypeValue(valueType, trigger) ?? '';
				field.setAttribute(valueSetAttribute, '');
			});
		});
	};
	setValue();

	setInterval(() => {
		setValue();
	}, 1000);
};

export default setValuesInFields;
