import { isDealPage, isUserControlPage } from '../../../../../utils/page-checker';
import { isNotEmptyArray } from '../../../../../utils/checks';
import { isTargetUserId } from '../../../../utils/checks';

const getManagerSelectNode = (text, extraClass = '') => {
	const node = document.createElement('span');
	node.classList.add('recode-manager-link');
	if (extraClass) {
		node.classList.add(extraClass);
	}
	node.textContent = text;

	return node;
};

const getValueFromSelect = ({ selectedIndex, options }) =>
	selectedIndex >= 0 ? options[selectedIndex].textContent.trim() : null;

const updateManagerSelect = (managerSelect, currentText) => {
	const currentManagerSelectElement = getManagerSelectNode(currentText);
	const newManagerSelectElement = getManagerSelectNode(
		'Недостаточно прав для изменения менеджера',
		'recode-manager-link--note'
	);
	const { parentNode } = managerSelect;
	parentNode.appendChild(currentManagerSelectElement);
	parentNode.appendChild(newManagerSelectElement);
	managerSelect.classList.add('hide');
};

const changeManager = ({ idList = [], notMode = false }) => {
	if (!isNotEmptyArray(idList) || typeof notMode !== 'boolean' || !(isDealPage || isUserControlPage)) {
		return;
	}

	const havePermission = notMode ? !isTargetUserId(idList) : isTargetUserId(idList);
	if (havePermission && !window.isSublogined) {
		return;
	}

	if (isDealPage) {
		const managerSelectNode = document.querySelector('.manager-link');
		if (managerSelectNode) {
			updateManagerSelect(managerSelectNode, managerSelectNode.textContent.trim());
		}
	}

	if (isUserControlPage) {
		const managerSelectNode = document.querySelector('[name="User[personal_manager_user_id]"]');
		if (managerSelectNode) {
			updateManagerSelect(managerSelectNode, getValueFromSelect(managerSelectNode));

			document.querySelector('.recode-manager-link:not(:last-child)').style.cssText += `
        margin-top: 5px;
        font-weight: bold;
      `;
		}
	}
};

export default changeManager;
