import { currentUrl } from '../../../utils/url-utils';
import { formsSelector, offerSelector, formCreateDealSelector } from '../config/constants';
import { createNode, hasDontResetSearchParamValue } from '../helpers/helpers';
import { getUserFields } from '../helpers/get-fields-data';

const addAnalyticFields = (fields) => {
	const fieldsUser = getUserFields(fields);

	const getField = (fieldName, fieldTitle) => {
		const field = document.createElement('input');

		if (fieldTitle) {
			field.setAttribute('data-field-title', fieldTitle);
		}
		field.setAttribute('name', fieldName);
		field.setAttribute('type', 'hidden');

		return field;
	};

	const getBlockForFields = () => {
		const block = createNode('div');
		block.setAttribute('data-for', 'recode-analytic-fields');
		block.setAttribute('data-author', 'recode studio (tg: @recode_solutions)');

		return block;
	};

	const getFilteredFields = (inputForm, inputFields) =>
		inputFields.filter(
			({ title, fieldSelector, trigger }) =>
				!(inputForm.querySelector(fieldSelector) || inputForm.querySelector(`[data-field-title="${title}"]`)) &&
				hasDontResetSearchParamValue(currentUrl, trigger)
		);

	const addFields = (mainBlock, mainBlockContentSelector, inputFields) => {
		const filteredFields = getFilteredFields(mainBlock, inputFields);
		const block = getBlockForFields();

		filteredFields.forEach(({ name, title }) => {
			block.appendChild(getField(name, title));
			if (mainBlock.querySelector(mainBlockContentSelector)) {
				mainBlock.querySelector(mainBlockContentSelector).appendChild(block);
			} else {
				mainBlock.appendChild(block);
			}
		});
	};

	const addFieldsInForm = () => {
		document.querySelectorAll(formsSelector).forEach((form) => {
			if (
				form.querySelector(offerSelector) ||
				form.closest('.need-create-deal') ||
				form.closest(formCreateDealSelector)
			) {
				addFields(form, '.builder', fields);
			} else {
				addFields(form, '.builder', fieldsUser);
			}
		});
	};
	addFieldsInForm();
};

export default addAnalyticFields;
