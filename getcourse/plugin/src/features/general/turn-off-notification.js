/* eslint-disable no-param-reassign */

import { isEmployee } from '../../../../utils/checks';
import { isNotificationPage } from '../../../../utils/page-checker';

const handleClickButton = (formNode, actionButton) => {
	actionButton.addEventListener('click', () => {
		const states = formNode.querySelectorAll('.state-selector');
		states.forEach((state) => {
			state.value = 0;
		});

		const checkboxes = formNode.querySelectorAll('input[type="checkbox"]');
		checkboxes.forEach((checkbox) => {
			checkbox.disabled = false;
			if (checkbox.checked) {
				checkbox.click();
			}
		});
	});
};

const createButton = () => {
	const node = document.createElement('a');
	node.classList.add('recode-turn-off-notification', 'btn', 'btn-default');
	node.textContent = 'Снять все галочки с уведомлений';

	return node;
};

const initTurnOffNotification = () => {
	if (!isEmployee) {
		return;
	}

	if (!isNotificationPage) {
		return;
	}

	const targetNode = document.querySelector('form > .row > .col-md-8');
	if (!targetNode) {
		return;
	}

	const actionButton = createButton();
	handleClickButton(targetNode, actionButton);
	targetNode.firstElementChild?.before(actionButton);
};

export default initTurnOffNotification;
