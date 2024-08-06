import settings from '../../config/settings';
import { isNotEmptyArray } from '../../../../../utils/checks';

const isValidConfig = (config) => isNotEmptyArray(config) && typeof config?.checked === 'boolean';

const controlCheckboxesFields = (fieldsConfig) => {
	const ignoredPages = [
		'/user/control/user/update/id/',
		'/pl/cms/page/editor',
		'/pl/lite/widget/editor',
		'/pl/logic/context/custom-fields',
	];

	const isIgnoredPage = ignoredPages.some((page) => window.location.pathname.includes(page));
	if (isIgnoredPage) {
		return;
	}

	fieldsConfig.forEach((config) => {
		if (!isValidConfig(config)) {
			return;
		}

		const { id } = config;
		const checked = config.checked || settings.controlCheckboxesFields.checkedDefault;
		const checkboxes = document.querySelectorAll(`#field-input-${id}`);

		checkboxes.forEach((checkbox) => {
			if (checkbox.type !== 'checkbox') {
				return;
			}

			if ((checked && !checkbox.checked) || (!checked && checkbox.checked)) {
				checkbox.click();
			}
		});
	});
};

export default controlCheckboxesFields;
