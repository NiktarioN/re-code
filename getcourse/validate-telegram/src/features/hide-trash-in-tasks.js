import { isPageWithTasks } from '../config/constants';

const hideTrashInTasks = () => {
	if (!isPageWithTasks) {
		return;
	}

	const styles = document.createElement('style');
	styles.id = 'recode-hide-trash-in-tasks';
	styles.innerHTML += `
  div:has(> .btn-take-task-link),
  .btn-take-task-link,
  .make-delay-btn {
    display: none !important;
  }
  `;

	document.head.appendChild(styles);
};

export default hideTrashInTasks;
