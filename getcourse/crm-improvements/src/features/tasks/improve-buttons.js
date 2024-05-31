import { isPageWithTasks } from '../../config/constants';

const improveTaskButtons = () => {
	if (!isPageWithTasks) {
		return;
	}

	document.querySelectorAll('.task-form').forEach(({ classList }) => classList.add('recode-task-improve-buttons'));
};

export default improveTaskButtons;
