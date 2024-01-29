import { isUrl } from '../../../../utils/url-utils';
import { surveyNameSelector } from '../config/constants';

const isNumber = (value) => !Number.isNaN(Number(value));

const isFile = (value) => {
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
	const commonFileExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip'];

	if (!value || typeof value !== 'string' || isUrl(value)) {
		return false;
	}

	return [...imageExtensions, ...commonFileExtensions].some((extension) =>
		value.trim().toLowerCase().endsWith(extension)
	);
};

const getValidationValue = (value) => {
	if (value === 0) {
		return 'Нет';
	}
	if (value === 1) {
		return 'Да';
	}
	if (isFile(value)) {
		return `Загружен файл: ${window.origin}/fileservice/control/account/storage?FileAccountStatStorageFilter[filename]=&FileAccountStatStorageFilter[stat_type]=0&FileAccountStatStorageFilter[path]=${value}`;
	}
	return value;
};

const getSurveyName = (node) => node.querySelector(surveyNameSelector)?.textContent?.trim();

const getText = (inputArray, inputBlock) => {
	const string = inputArray.reduce((accumulator, [id, value], index) => {
		const title = inputBlock.querySelector(`[for="field-input-${id}"] .label-value`)?.textContent;

		accumulator.push(`Вопрос ${index + 1}: ${title} \nОтвет: ${getValidationValue(value)}`);

		return accumulator;
	}, []);

	return string.join('\n\n');
};

const getFieldsArray = (userFieldId, dealFieldId) => {
	const result = [];

	if (isNumber(userFieldId)) {
		result.push({
			name: `formParams[userCustomFields][${userFieldId}]`,
			title: 'user_survey',
			fieldSelector: `[name="formParams[userCustomFields][${userFieldId}]"]`,
		});
	}
	if (isNumber(dealFieldId)) {
		result.push({
			name: `formParams[dealCustomFields][${dealFieldId}]`,
			title: 'deal_survey',
			fieldSelector: `[name="formParams[dealCustomFields][${dealFieldId}]"]`,
		});
	}

	return result;
};

const getParsedData = (data) => {
	try {
		return Object.entries(JSON.parse(data));
	} catch (error) {
		global.console.error('RE-CODE STUDIO. Плагин gcSurveyParser. Ошибка при разборе данных анкеты:', error);
		return [];
	}
};

export { getValidationValue, getSurveyName, getText, getFieldsArray, getParsedData, isNumber };
