import { offerSelector, formCreateDealSelector } from '../config/constants';

const addFieldsInForm = (form, fields) => {
	const userField = fields.filter(({ name }) => name.includes('userCustomFields'));

	const getField = (fieldName, fieldTitle) => {
		const field = document.createElement('input');

		if (fieldTitle) {
			field.setAttribute('data-field-title', fieldTitle);
		}
		field.setAttribute('name', fieldName);
		field.setAttribute('type', 'hidden');

		return field;
	};

	const getFilteredFields = (inputForm, inputFields) =>
		inputFields.filter(({ fieldSelector }) => !inputForm.querySelector(fieldSelector));

	const addFields = (inputForm, inputFormContentSelector, inputFields) => {
		const filteredFields = getFilteredFields(inputForm, inputFields);

		filteredFields.forEach(({ name, title }) => {
			if (inputForm.querySelector(inputFormContentSelector)) {
				inputForm.querySelector(inputFormContentSelector).appendChild(getField(name, title));
			} else {
				inputForm.appendChild(getField(name, title));
			}
		});
	};

	if (form.querySelector(offerSelector) || form.closest(formCreateDealSelector)) {
		addFields(form, '.builder', fields);
	} else {
		addFields(form, '.builder', userField);
	}
};

export default addFieldsInForm;
