// TODO:
// Добавить дополнительную проверку на игнорируемые параметры в тренингах и уроках, чтобы они не ломали функционал
// Добавить для создания полей возможность указать тип поля (input или textarea), чтобы можно было записывать все параметры
// Переработать запись параметров через изменение DOM, а не через атрибут
// Стоит ли давать пользователям добавлять свои параметры для не обнуления

/**
 * Plugin Name: gcModuleAnalytics
 * Description: Модуль аналитики на GetCourse
 * Version: 2.2
 */

import {
	isEditorPage,
	isOfferSettingsPage,
	isGetcourseWorkPage,
	isUserDealsPage,
	ignoreSearchParams,
} from './config/constants';
import { currentUrl, getAllSearchParams } from '../../utils/url-utils';
import addAnalyticFields from './modules/add-fields';
import { getReformedFields, getParamFields, getCookieFields, getOtherFields } from './helpers/get-fields-data';
import setValueManually from './modules/values-manually';
import setValuesInFields from './modules/values-in-fields';
import setSearchParamsInElements from './modules/set-search-params';
import redirectWithSearchParams from './modules/redirect-using-code';
import redirectUsingClass from './modules/redirect-using-class';
import validateOfferSettings from './modules/validate-offer-settings';
import hideSystemOrders from './modules/hide-system-orders';
import setConfig from './config/config';

window.recode = {
	...(window.recode || {}),
	gcModuleAnalytics: {
		init(options = {}) {
			if (this.config) {
				throw new Error('RE-CODE STUDIO. Плагин gcModuleAnalytics. Повторная инициализация функционала невозможна');
			}

			this.config = setConfig(options);

			const fields = getReformedFields(this.config.fields);
			const fieldsParam = getParamFields(fields);
			const fieldsCookie = getCookieFields(fields);
			const fieldsOther = getOtherFields(fields);

			addAnalyticFields(fields);
			setValuesInFields(fieldsOther);
			setValueManually('value');
			redirectUsingClass();

			if (document.cookie) {
				setValueManually('cookie');
				setValuesInFields(fieldsCookie);
			}

			const windowSearchParams = getAllSearchParams(currentUrl.href);
			const allWindowSearchParams = [...windowSearchParams];
			const filteredWindowSearchParams = [...windowSearchParams].filter(
				([name]) => !ignoreSearchParams.some((ignoreSearchParam) => ignoreSearchParam === name)
			);

			if (allWindowSearchParams.length) {
				setValueManually('param');
				setValuesInFields(fieldsParam);
			}

			if (!isEditorPage && isGetcourseWorkPage && filteredWindowSearchParams.length) {
				setSearchParamsInElements(filteredWindowSearchParams);
			}

			if (isOfferSettingsPage) {
				validateOfferSettings();
			}

			if (isUserDealsPage) {
				hideSystemOrders(this.config.hideSystemOrders.searchWords, this.config.hideSystemOrders.hideFromEmpoyees);
			}
		},
		redirectWithSearchParams(inputUrl, redirectMode = this.config.redirectMode) {
			redirectWithSearchParams(inputUrl, redirectMode);
		},
	},
};
