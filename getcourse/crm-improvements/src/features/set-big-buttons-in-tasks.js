import { isPageWithTasks } from '../config/constants';

const setBigButtonsInTasks = () => {
	if (!isPageWithTasks) {
		return;
	}

	document.querySelectorAll('.task-form').forEach(({ classList }) => classList.add('recode-task-big-buttons'));
};

export default setBigButtonsInTasks;
