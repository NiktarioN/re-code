import { isOneOfferSettingsPage } from '../../../../../utils/page-checker';

const disableOfferAutoMessage = () => {
	if (!isOneOfferSettingsPage) {
		return;
	}

	const notSendMessageCheckBox = document.querySelector('#paramsobject-not_send_message');
	if (notSendMessageCheckBox && !notSendMessageCheckBox.checked) {
		notSendMessageCheckBox.checked = true;
	}
};

export default disableOfferAutoMessage;
