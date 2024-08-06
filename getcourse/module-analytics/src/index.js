// TODO:
// Добавить дополнительную проверку на игнорируемые параметры в тренингах и уроках, чтобы они не ломали функционал
// Добавить для создания полей возможность указать тип поля (input или textarea), чтобы можно было записывать все параметры
// Переработать запись параметров через изменение DOM, а не через атрибут
// Стоит ли давать пользователям добавлять свои параметры для не обнуления

/**
 * Plugin Name: gcModuleAnalytics
 * Description: Модуль аналитики на GetCourse
 */

import setConfig from './config/config';
import { isEditorPage, isGetcourseWorkPage, ignoreSearchParams } from './config/constants';
import { currentUrl, getAllSearchParams } from '../../../utils/url-utils';
import addAnalyticFields from './features/add-fields';
import { getReformedFields, getParamFields, getCookieFields, getOtherFields } from './helpers/get-fields-data';
import setValueManually from './features/values-manually';
import setValuesInFields from './features/values-in-fields';
import setSearchParamsInElements from './features/set-search-params';
import transferParams from './features/redirect-using-code';
import redirectUsingClass from './features/redirect-using-class';
import validateOfferSettings from '../../plugin/src/features/offer-settings/validate-settings';
import hideSystemOrders from '../../plugin/src/features/general/hide-system-orders';
import settingsBlockController from './features/controlles/cms-settings';

window.recode = {
	...(window.recode || {}),
	gcModuleAnalytics: {
		init(options = {}) {
			if (this.config) {
				throw new Error('RE-CODE STUDIO. Плагин gcModuleAnalytics. Повторная инициализация функционала невозможна');
			}

			this.config = setConfig(options);
			const { fields: fieldsConfig, hideSystemOrders: hideSystemOrdersConfig } = this.config || {};
			const fields = getReformedFields(fieldsConfig);
			const fieldsParam = getParamFields(fields);
			const fieldsCookie = getCookieFields(fields);
			const fieldsOther = getOtherFields(fields);

			addAnalyticFields(fields);
			setValuesInFields(fieldsOther);
			setValueManually('value');
			setValueManually('text');
			redirectUsingClass();
			settingsBlockController();

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

			if (!window?.recode?.gcPlugin) {
				validateOfferSettings();
				hideSystemOrders(hideSystemOrdersConfig);
			}
		},

		redirectWithSearchParams(inputUrl, redirectMode = this.config.redirectMode) {
			transferParams(inputUrl, redirectMode);
		},

		functions() {
			// eslint-disable-next-line no-console
			console.log(
				`
        Плагин gcModuleAnalytics. Памятка по функционалу

        Функциональные классы для разных блоков:
        recode-form-create-deal — класс для форм, если нужно показать создание заказа,
        recode-transfer-params — класс для кнопок, если нужно сделать передачу параметров на другие страницы,
        recode-value-ЗНАЧЕНИЕ — класс для блока с доп. полем, если мы хотим прописать значение ВРУЧНУЮ,
        recode-param-ЗНАЧЕНИЕ — класс для блока с доп. полем, если мы хотим прописать значение конкретного параметра из URL,
        recode-cookie-ЗНАЧЕНИЕ — класс для блока с доп. полем, если мы хотим прописать значение конкретного параметра из COOKIE,

        Дополнительные параметры для записи параметров в доп. поля. Указывать отдельно в настройках:
        referrer — Откуда пришел пользователь (с какой страницы),
        url_full — Страница создания заказа (полный вариант с параметрами),
        url_clean — Страница создания заказа (только сама страница без параметров),
        created_date — Дата создания заказа,
        part_of_day — Время создания заказа (утро, день, вечерь ночь),
        created_type — Кем был создан заказ (пользователь, менеджер),
        widget_url — Страница виджета,
        device_type — С какого типа девайса был создан заказ
        script_completed — Проверка на корректность срабатывания скрипта

        Функциональные команды:
        recode.transferParams('URL'); — Перенос всех параметров из URL через форму
        `
			);
		},
	},

	transferParams(inputUrl, redirectMode = 'current-window') {
		transferParams(inputUrl, redirectMode);
	},
};
