/**
 * Plugin Name: setSearchParamsInFields
 * Description: Установка значений параметров из URL в поля
 * Author: RE-CODE STUDIO
 * Author URL: tg: https://techeducation.ru/y/8bbf221
 */

import { currentUrl, getSearchParamValue, getFilteredSearchParams } from '../../../utils/url-utils';

const valueSetAttribute = 'data-recode-value-set';

const getCurrentPageUrl = () => {
	const url = new URL(currentUrl.href);
	const filteredSearchParams = getFilteredSearchParams(url.href, ['id']);

	return filteredSearchParams.toString()
		? `${url.origin}${url.pathname}?${filteredSearchParams}`
		: `${url.origin}${url.pathname}`;
};

const getReformedFieldsArray = (fieldsArray) =>
	fieldsArray.map(([fieldId, fieldType, searchParam]) => [
		`[name="formParams[${fieldType.toLowerCase()}CustomFields][${fieldId}]"]`,
		searchParam,
	]);

window.recode = {
	...(window.recode || {}),
	setSearchParamsInFields: {
		init(options = {}) {
			if (this.config) {
				throw new Error(
					'RE-CODE STUDIO. Плагин setSearchParamsInFields. Повторная инициализация функционала невозможна'
				);
			}

			this.config = {
				fields: {
					searchParams: options.searchParamsFields || [],
					dealCreatedUrl: options.dealCreatedUrl || null,
				},
			};

			const searchParamsFields = getReformedFieldsArray(this.config.fields.searchParams);
			const dealCreatedUrlFieldSelector = this.config.fields.dealCreatedUrl
				? `[name="formParams[dealCustomFields][${this.config.fields.dealCreatedUrl}]"]`
				: null;

			const setValues = () => {
				searchParamsFields.forEach(([fieldSelector, searchParam]) => {
					document.querySelectorAll(`${fieldSelector}:not([${valueSetAttribute}])`).forEach(($field) => {
						const field = $field;
						field.value = getSearchParamValue(currentUrl.href, searchParam) ?? '';
						field.setAttribute(valueSetAttribute, '');
					});
				});
				if (dealCreatedUrlFieldSelector) {
					document.querySelectorAll(`${dealCreatedUrlFieldSelector}:not([${valueSetAttribute}])`).forEach(($field) => {
						const field = $field;
						field.value = getCurrentPageUrl() || 'none';
						field.setAttribute(valueSetAttribute, '');
					});
				}
			};
			setValues();

			setInterval(() => {
				setValues();
			}, 1000);
		},
	},
};
