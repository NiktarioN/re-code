/* eslint-disable no-param-reassign */

import { CONFIG } from './core/config';
import { SELECTORS } from '../../../config/constants';
import { GLOBAL_CONFIG } from '../../../config/config';
import { getLocalSetting, updateLocalSetting } from '../../../modules/local-settings-manager';
import { createElement } from '../../../../../../utils/dom';
import createCommentButton from './ui/comment-button';
import buildModalElements from './ui/modal-elements';
import { openModal, closeModal, resetForm, handleSubmitClick } from './handlers/modal-handlers';
import { setupCharCounter } from './features/counter';
import setupDraftSaving from './features/save-draft';
import { formHasSearchWords } from '../../../../../utils/checks';

const initCommentSystem = (targetElement) => {
  if (!targetElement || targetElement.querySelector(`.${CONFIG.CLASSES.ADD_COMMENT_BUTTON}`)) {
    return;
  }

  const isUserTask = !!targetElement.querySelector('[data-info-url^="/pl/user/user/mini-card"]');
  const taskObject = isUserTask ? 'user' : 'deal';

  const {
    modal,
    typeSelect,
    textarea,
    counter,
    statusMessage,
    reloadCheckboxInput,
    reloadCheckboxWrapper,
    clearButton,
    cancelButton,
    submitButton,
  } = buildModalElements(taskObject);

  const button = createCommentButton();
  const container = createElement('div', { class: `${CONFIG.CLASSES.ACTIONS_CONTAINER}` });

  container.append(button);

  if (targetElement.matches(SELECTORS.TASK.OBJECT)) {
    targetElement.append(container);
  } else if (targetElement.matches(SELECTORS.TASK.HEAD)) {
    targetElement.append(container);
    container.style.marginTop = '10px';
  } else {
    return;
  }

  const modalElements = { modal, textarea, clearButton, typeSelect, counter, statusMessage };

  reloadCheckboxInput.checked = getLocalSetting(CONFIG.SETTINGS_PATH.RELOAD_AFTER_COMMENT);

  reloadCheckboxInput.addEventListener('change', (event) => {
    updateLocalSetting(CONFIG.SETTINGS_PATH.RELOAD_AFTER_COMMENT, event.target.checked);
  });

  setupCharCounter(textarea, clearButton, counter);

  if (!counter) {
    reloadCheckboxWrapper.style.marginTop = '15px';
  }

  setupDraftSaving(modal, textarea);

  button.addEventListener('click', () => openModal(modalElements));
  cancelButton.addEventListener('click', () => closeModal(modalElements));
  submitButton.addEventListener('click', async () => handleSubmitClick(modalElements, submitButton));
  clearButton.addEventListener('click', () => resetForm(modalElements));
};

const init = (forms) => {
  forms.forEach((form) => {
    const hasSearchWords = formHasSearchWords(form, GLOBAL_CONFIG.hideTasksInOrder.searchWords);
    if (hasSearchWords) {
      return;
    }

    const targetElement = form.querySelector(SELECTORS.TASK.OBJECT) || form.querySelector(SELECTORS.TASK.HEAD);
    if (targetElement) {
      initCommentSystem(targetElement);
    }
  });
};

export default init;
