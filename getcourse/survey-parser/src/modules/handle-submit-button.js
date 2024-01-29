import { surveyDataSelector } from '../config/constants';
import { getSurveyName, getText, getParsedData } from '../helpers/helpers';

const handleSubmitButtonClick = (form, fields) => {
	const surveyData = form.querySelector(surveyDataSelector)?.value;
	if (!surveyData) {
		return;
	}

	const answers = getParsedData(surveyData);
	const name = getSurveyName(form);

	let text = getText(answers, form);
	if (name) {
		text = `Название анкеты: ${name}\n\n${text}`;
	}

	fields.forEach(({ fieldSelector }) => {
		const field = form.querySelector(fieldSelector);
		if (field) {
			field.value = text;
		}
	});
};

export default handleSubmitButtonClick;
