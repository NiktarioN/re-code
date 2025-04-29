import { isPageWithFieldsSettings } from '../../../../utils/page-checker';

const improvePageWithFieldsSettings = () => {
	if (!isPageWithFieldsSettings) {
		return;
	}

	document.querySelectorAll('.control-buttons, .field-settings-editor').forEach(({ style, classList }) => {
		classList.add('recode-sticky-editor');

		if (classList.contains('control-buttons')) {
			// eslint-disable-next-line no-param-reassign
			style.zIndex = 999;
		}
	});
};

export default improvePageWithFieldsSettings;
