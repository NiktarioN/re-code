import { isMailingSettingsPage } from '../../../../../utils/page-checker';

const setSendAllMailingSettings = () => {
	if (!isMailingSettingsPage) {
		return;
	}

	const sendAllCheckBox = document.querySelector('#ParamsObject_send_to_0');
	if (!sendAllCheckBox) {
		return;
	}

	if (!sendAllCheckBox.checked) {
		sendAllCheckBox.checked = true;
	}

	const sendAllCheckBoxParent = sendAllCheckBox.closest('.mailing-params');
	if (sendAllCheckBoxParent) {
		sendAllCheckBoxParent.classList.add('hide');
	}
};

export default setSendAllMailingSettings;
