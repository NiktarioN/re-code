import { isEmployee } from '../../../../utils/checks';
import { formCreateDealSelector } from '../../config/constants';
import addSettingСlass from '../settings-block/add-setting-class';

const settingsBlockController = () => {
	if (!isEmployee) {
		return;
	}

	if (!document.querySelectorAll('.lt-block').length) {
		return;
	}

	const handleSettingsBlockContent = (inputNode) => {
		const observer = new MutationObserver(() => {
			const isActionButtton = !!inputNode.querySelector('.form-control[name*="[inner][action][link]"]');
			const isFormButton =
				(inputNode.querySelector('[name="value[submitButton][name]"]') ||
					inputNode.querySelector('[id^="palleteBtn"]')) &&
				!inputNode.querySelector('.form-control[name*="[inner][action][link]"]');

			if (isActionButtton) {
				observer.disconnect();

				const settings = {
					parentNode: inputNode,
					targetNodeSelector: '.form-control[name*="[inner][action][link]"]',
					settingСlass: 'recode-transfer-params',
					settingLabel: '[RE-CODE] Пробрасывать все параметры из URL с текущей страницы',
					settingCss:
						'cursor: pointer; display: table-caption; caption-side: bottom; margin-top: 10px; font-weight: 700;',
				};
				addSettingСlass(settings);
			}

			if (isFormButton) {
				observer.disconnect();

				const settings = {
					parentNode: inputNode,
					targetNodeSelector: '.settings-border-radius',
					settingСlass: formCreateDealSelector.slice(1),
					settingLabel:
						'[RE-CODE] В форме создается заказ только через обработчик и нужно добавить доп. поля для аналитики',
					settingCss: 'cursor: pointer; margin-top: 10px; margin-bottom: 0; font-weight: 700;',
				};
				addSettingСlass(settings);
			}
		});

		observer.observe(inputNode, { childList: true, subtree: true });
	};

	const handleSettingsBlock = () => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1 && node.matches('.popover')) {
						handleSettingsBlockContent(node);
					}
				});
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });
	};
	handleSettingsBlock();
};

export default settingsBlockController;
