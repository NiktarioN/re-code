import { isPageWithTasks, isProcessEditorPage } from '../../../../utils/page-checker';

const improveTaskButtons = () => {
	if (!isPageWithTasks || isProcessEditorPage) {
		return;
	}

	document.querySelectorAll('.task-form').forEach(({ classList }) => classList.add('recode-task-improve-buttons'));
};

export default improveTaskButtons;
