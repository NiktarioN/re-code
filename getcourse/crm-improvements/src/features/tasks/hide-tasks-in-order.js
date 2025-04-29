/* eslint-disable no-console */

import settings from '../../config/settings';
import { isDealPage } from '../../../../utils/page-checker';
import { isUserProfilePage, PLUGIN_NAME } from '../../config/constants';
import { isNotEmptyArray } from '../../../../../utils/checks';
import { isTargetUserId } from '../../../../utils/checks';

const isValidConfig = (idList, notMode, searchWords) =>
  isNotEmptyArray(idList) && isNotEmptyArray(searchWords) && typeof notMode === 'boolean';

const hideTasksInOrder = (config) => {
  const {
    usersList: {
      idList = settings.hideTasksInOrder.usersList.idList,
      notMode = settings.hideTasksInOrder.usersList.notMode,
    },
    searchWords = settings.hideTasksInOrder.searchWords,
  } = config;

  if (!isValidConfig(idList, notMode, searchWords)) {
    return;
  }

  if (!isDealPage && !isUserProfilePage) {
    return;
  }

  const hideTasks = (words) => {
    const taskNodes = document.querySelectorAll('.task-form .task-title > a[href*="/pl/tasks/task/view"]');
    taskNodes.forEach((node) => {
      const taskForm = node.closest('.task-form');
      const taskParentNode = taskForm?.parentNode;
      if (!taskParentNode || !taskForm) {
        return;
      }

      const taskTitleLowerCase = node.textContent.trim().toLowerCase();
      if (words.some((word) => taskTitleLowerCase.includes(word.toLowerCase()))) {
        taskParentNode.classList.add('hide');
      }
    });
  };

  const shouldHideTasks = notMode ? isTargetUserId(idList) : !isTargetUserId(idList);
  if (shouldHideTasks) {
    hideTasks(searchWords);
    console.log(`${PLUGIN_NAME}. Функция hideTasksInOrder. Выполнено скрытые технических задач`);
    return;
  }
  console.log(`${PLUGIN_NAME}. Функция hideTasksInOrder. Скрывать технические задачи не нужно`);
};

export default hideTasksInOrder;
