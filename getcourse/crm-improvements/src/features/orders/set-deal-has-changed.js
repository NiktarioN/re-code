import { isNumber } from '../../../../../utils/checks';
import { dealFieldsNodeSelector } from '../../config/constants';
import { isDealPage } from '../../../../../utils/page-checker';

const setDealHasChanged = (fieldId) => {
	const clickOnCheckBox = () => {
		const checkBox = document.querySelector(`#field-input-${fieldId}`);
		if (checkBox && !checkBox.checked) {
			checkBox.click();
		}
	};

	const disconnectObserver = (observer) => {
		if (observer) {
			observer.disconnect();
		}
	};

	if (!isDealPage) {
		return;
	}

	if (!isNumber(fieldId)) {
		throw new Error(
			'RE-CODE STUDIO. Плагин gcCrmImprovements. В настройке dealHasChangedFieldId неправильно указан ID поля. Там должно быть только число'
		);
	}

	const dealFieldsNode = document.querySelector(dealFieldsNodeSelector);
	if (dealFieldsNode) {
		clickOnCheckBox();
		return;
	}

	const observer = new MutationObserver(() => {
		if (dealFieldsNode) {
			disconnectObserver(observer);
			clickOnCheckBox();
		}
	});
	observer.observe(document.body, { subtree: true, childList: true });
	setTimeout(() => disconnectObserver(observer), 30000);
};

export default setDealHasChanged;
