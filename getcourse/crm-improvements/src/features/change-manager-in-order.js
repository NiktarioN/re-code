import { isDealPage } from '../../../../utils/page-checker';
import { isNotEmptyArray } from '../../../../utils/checks';

const changeManagerInOrder = (config) => {
	const { idList = [], notMode = false } = config;

	const isTargetUserId = (ids) => ids.some((id) => id.toString() === window.accountUserId.toString());

	const getManagerSelectNode = (text) => {
		const node = document.createElement('span');
		node.classList.add('manager-link', 'recode-manager-link');
		node.textContent = text;

		return node;
	};

	if (!isNotEmptyArray(idList) || typeof notMode !== 'boolean' || !isDealPage) {
		return;
	}

	const havePermission = notMode ? !isTargetUserId(idList) : isTargetUserId(idList);
	if (havePermission && !window.isSublogined) {
		return;
	}

	const managerSelectLink = document.querySelector('.manager-link');
	if (!managerSelectLink) {
		return;
	}

	const currentManagerSelectElement = getManagerSelectNode(managerSelectLink.textContent.trim());
	const newManagerSelectElement = getManagerSelectNode('Недостаточно прав для изменения менеджера');
	newManagerSelectElement.classList.add('recode-manager-link--note');

	const { parentNode } = managerSelectLink;
	parentNode.appendChild(currentManagerSelectElement);
	parentNode.appendChild(newManagerSelectElement);
	managerSelectLink.remove();
};

export default changeManagerInOrder;
