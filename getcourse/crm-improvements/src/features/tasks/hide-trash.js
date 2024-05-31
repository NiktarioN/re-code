import { isPageWithTasks } from '../../config/constants';

const hideTrashInTasks = () => {
	if (!isPageWithTasks) {
		return;
	}

	document.querySelectorAll('.task-form').forEach(({ classList }) => classList.add('recode-task-hide-trash'));
};

export default hideTrashInTasks;
