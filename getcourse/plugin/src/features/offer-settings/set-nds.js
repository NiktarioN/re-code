import { isOneOfferSettingsPage } from '../../../../../utils/page-checker';

const setOfferNds = () => {
	if (!isOneOfferSettingsPage) {
		return;
	}

	const ndsOption = document.querySelector('[name="ParamsObject[vat]"]');
	if (ndsOption && ndsOption.value.trim() === '') {
		ndsOption.value = 'none';
	}
};

export default setOfferNds;
