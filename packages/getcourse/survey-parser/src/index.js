// ШАГИ

/**
 * Plugin Name: gcSurveyParser
 * Description: Парсер анкеты на GetCourse
 * Version: 1.0
 */

import { formsSelector, surveyDataSelector } from './config/constants';
import { getFieldsArray } from './helpers/helpers';
import addFieldsInForm from './modules/add-fields';
import handleSubmitButtonClick from './modules/handle-submit-button';
import setConfig from './config/config';

window.recode = {
	...(window.recode || {}),
	gcSurveyParser: {
		init(options = {}) {
			if (this.config) {
				throw new Error('RE-CODE STUDIO. Плагин gcSurveyParser. Повторная инициализация функционала невозможна');
			}

			this.config = setConfig(options);

			const { userFieldId, dealFieldId } = this.config;
			if (!(userFieldId || dealFieldId)) {
				throw new Error('RE-CODE STUDIO. Плагин gcSurveyParser. Не прописаны параметры доп. полей в конфиге плагина');
			}

			const fields = getFieldsArray(userFieldId, dealFieldId);
			if (!fields.length) {
				return;
			}

			document.querySelectorAll(formsSelector).forEach((form) => {
				if (!form.querySelector(surveyDataSelector)) {
					return;
				}

				addFieldsInForm(form, fields);

				const submitButton = form.querySelector('[type="submit"]');
				submitButton?.addEventListener('click', () => {
					handleSubmitButtonClick(form, fields);
				});
			});
		},
	},
};
