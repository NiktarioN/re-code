import { isPageWithTasks } from '../config/constants';

const setBigButtonsInTasks = () => {
	if (!isPageWithTasks) {
		return;
	}

	const styles = document.createElement('style');
	styles.id = 'recode-big-buttons-in-tasks';
	styles.innerHTML = `
  .task-form .task-jobs .abstract-job-widget .results-block {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    width: 100%;
    padding: 0px !important;
  }

  .task-form .task-jobs .abstract-job-widget .btn {
    border-radius: 6px !important;
  }

  @media (max-width: 768px) {
    .task-form .task-jobs .abstract-job-widget .results-block {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 576px) {
    .task-form .task-jobs .abstract-job-widget .results-block {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .task-form .task-jobs .abstract-job-widget [data-field="comment"] {
    margin-bottom: 15px;
  }
  `;

	document.head.appendChild(styles);
};

export default setBigButtonsInTasks;
