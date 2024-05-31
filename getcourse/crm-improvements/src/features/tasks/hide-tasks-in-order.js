import { isDealPage } from '../../../../../utils/page-checker';
import { isUserProfilePage } from '../../config/constants';
import { isNotEmptyArray } from '../../../../../utils/checks';
import { isTargetUserId } from '../../../../utils/checks';

const hideTasksInOrder = ({ usersList: { idList = [], notMode = false } = {}, searchWords = [] }) => {
	if (!isDealPage && !isUserProfilePage) {
		return;
	}

	if (!isNotEmptyArray(idList) || !isNotEmptyArray(searchWords) || typeof notMode !== 'boolean') {
		return;
	}

	const hideTasks = (words) => {
		const taskNodes = document.querySelectorAll('.task-form .task-title > a[href*="/pl/tasks/task/view"]');
		taskNodes.forEach((node) => {
			const taskForm = node.closest('.task-form');
			const taskParentNode = taskForm?.parentNode;

			if (!taskParentNode || !taskForm) {
				return;
			}

			const taskTitleLowerCase = node.textContent.trim().toLowerCase();

			if (words.some((word) => taskTitleLowerCase.includes(word.toLowerCase()))) {
				taskParentNode.classList.add('hide');
			}
		});
	};

	const shouldHideTasks = notMode ? isTargetUserId(idList) : !isTargetUserId(idList);
	if (shouldHideTasks) {
		hideTasks(searchWords);
	}
};

export default hideTasksInOrder;
