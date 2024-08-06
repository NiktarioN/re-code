import { isPageWithTasks, isOneTaskControlPage } from '../../../../../utils/page-checker';
import { isAdmin } from '../../../../utils/checks';

const hideTrashInTasks = () => {
	if (!isPageWithTasks && !isOneTaskControlPage) {
		return;
	}

	if (isPageWithTasks) {
		document.querySelectorAll('.task-form').forEach(({ classList }) => classList.add('recode-task-hide-trash'));
	}

	if (isOneTaskControlPage) {
		const refuseButton = document.querySelector(
			'.btn[data-confirm="Вы уверены что хотите отказаться от этой задачи?"]'
		);
		refuseButton?.classList.add('hide');

		if (!isAdmin) {
			const deleteButton = document.querySelector('.btn[data-confirm="Вы уверены что хотите удалить эту задачу?"]');
			deleteButton?.classList.add('hide');
		}
	}
};

export default hideTrashInTasks;
