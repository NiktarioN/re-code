import { isPageWithTasks } from '../../config/constants';

const hideTaskDelayBtn = () => {
	if (!isPageWithTasks) {
		return;
	}

	document.querySelectorAll('.task-form').forEach(({ classList }) => classList.add('recode-task-hide-delay-btn'));
};

export default hideTaskDelayBtn;
