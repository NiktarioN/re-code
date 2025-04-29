import { isEditMode } from '../../../utils/page-checker';

const settingsFormController = () => {
	if (!isEditMode || !document.querySelector('.lt-form')) {
		return;
	}

	const handleSettingsForm = () => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1 && node.matches('.part-type-createDeal')) {
						const checkbox = node.querySelector('.part-name-checkDealUnique input[type="checkbox"]');
						if (checkbox && !checkbox.checked) {
							checkbox.click();
						}
					}
				});
			});
		});

		const targetBlock = document.querySelector('form.settings');
		if (!targetBlock) {
			return;
		}

		observer.observe(targetBlock, { childList: true, subtree: true });
	};
	handleSettingsForm();
};

export default settingsFormController;
