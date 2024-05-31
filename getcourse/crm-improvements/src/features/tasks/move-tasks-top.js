import { isUserProfilePage } from '../../config/constants';
import { isDealPage } from '../../../../../utils/page-checker';

const moveTasksToTheTop = () => {
	if (!isDealPage && !isUserProfilePage) {
		return;
	}

	const searchWords = ['[оп]'];
	const pageHeaderNode = document.querySelector('.page-header');
	const collapseAllTasksNode = [...document.querySelectorAll('.text-muted')].find(
		({ textContent }) => textContent.trim() === 'Свернуть все задачи'
	)?.parentElement;

	document.querySelectorAll('.task-form .task-title > a[href*="/pl/tasks/task/view"]').forEach((node) => {
		const taskForm = node.closest('.task-form');
		const taskParentNode = taskForm?.parentNode;

		if (!taskParentNode || !taskForm) {
			return;
		}

		const taskTitleLowerCase = node.textContent.trim().toLowerCase();

		const hasSearchWord = searchWords.some((word) => taskTitleLowerCase.includes(word.toLowerCase()));
		if (!hasSearchWord) {
			return;
		}

		if (collapseAllTasksNode) {
			collapseAllTasksNode.after(taskParentNode);
		} else if (pageHeaderNode) {
			pageHeaderNode.after(taskParentNode);
		}
	});
};

export default moveTasksToTheTop;
