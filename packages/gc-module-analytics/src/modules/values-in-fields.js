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
	getPartOfDay,
	getDeviceType,
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
		case 'part_of_day':
			return getPartOfDay();
		case 'created_type':
			return dealCreatedType;
		case 'widget_url':
			return widgetUrl;
		case 'device_type':
			return getDeviceType();
		case 'script_completed':
			return '1';
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
