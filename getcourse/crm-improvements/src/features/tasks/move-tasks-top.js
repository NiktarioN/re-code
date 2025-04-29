import settings from '../../config/settings';
import { isUserProfilePage } from '../../config/constants';
import { isDealPage } from '../../../../utils/page-checker';

const moveTasksToTheTop = () => {
  if (!isDealPage && !isUserProfilePage) {
    return;
  }

  const { searchWords } = settings.moveTasksToTheTop
  const pageHeader = document.querySelector('.page-header');
  const collapseAllTasksNode = [...document.querySelectorAll('.text-muted')].find(
    ({ textContent }) => textContent.trim() === 'Свернуть все задачи'
  )?.parentElement;

  document.querySelectorAll('.task-form .task-title > a[href*="/pl/tasks/task/view"]').forEach((node) => {
    const taskForm = node.closest('.task-form');
    const taskParentNode = taskForm?.parentNode;
    taskParentNode.classList.add('task-form-wrapper');
    if (!taskParentNode || !taskForm) {
      return;
    }

    const taskTitleLowerCase = node.textContent.trim().toLowerCase();
    const hasSearchWord = searchWords.some((word) => taskTitleLowerCase.includes(word.toLowerCase()));
    if (!hasSearchWord) {
      return;
    }

    if (collapseAllTasksNode) {
      const isParentElementFromFaggot = collapseAllTasksNode?.parentElement?.style?.cssText === 'display: flex; gap: 1em; margin-bottom: 0.5em;';

      if (isParentElementFromFaggot) {
        collapseAllTasksNode.parentElement.after(taskParentNode);
      } else {
        collapseAllTasksNode.after(taskParentNode);
      }
    } else if (pageHeader) {
      pageHeader.after(taskParentNode);
    }
  });
};

export default moveTasksToTheTop;