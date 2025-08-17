import settings from '../../config/default-settings';
import { isPageWithTasks } from '../../config/constants';

const CONFIG = {
  SEARCH_WORDS: ['[ОП]'],
  WORK_CLASS: 'recode-task-hide-delay-btn',
};

const hideTasks = (words) => {
  const taskLinkNodes = document.querySelectorAll('.task-form .task-title > a[href*="/pl/tasks/task/view"]');
  taskLinkNodes.forEach((node) => {
    const taskForm = node.closest('.task-form');
    if (!taskForm) {
      return;
    }

    const taskTitleLowerCase = node.textContent.trim().toLowerCase();
    if (words.some((word) => taskTitleLowerCase.includes(word.toLowerCase()))) {
      taskForm.classList.add(CONFIG.WORK_CLASS);
    }
  });
};

const app = (config) => {
  if (!isPageWithTasks) {
    return;
  }

  const mode = config.mode || settings.hideTaskDelayBtn.mode;

  if (mode === 'all') {
    document.querySelectorAll('.task-form').forEach(({ classList }) => classList.add(CONFIG.WORK_CLASS));
  }
  if (mode === 'op') {
    hideTasks(CONFIG.SEARCH_WORDS);
  }
};

export default app;