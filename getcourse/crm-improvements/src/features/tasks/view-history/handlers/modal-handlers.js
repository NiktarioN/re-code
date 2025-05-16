/* eslint-disable no-param-reassign */

import { CONFIG, MESSAGES } from '../core/config';
import { CLASSES } from '../../../../config/constants';
import { getLocalSetting, updateLocalSetting } from '../../../../modules/local-settings-manager';
import { updateCounter, resetCounter } from '../features/counter';
import { validateComment, sendComment } from '../features/comments';
import setStatusMessage from '../ui/status-messages';
import { normalizeSpaces } from '../../../../../../../utils/helpers';

const openModal = (modalElements) => {
  const { modal, textarea, clearButton, counter, statusMessage } = modalElements;
  const draftComment = getLocalSetting(CONFIG.SETTINGS_PATH.DRAFT_COMMENT);

  textarea.value = normalizeSpaces(draftComment);

  updateCounter(textarea, clearButton, counter);
  setStatusMessage(statusMessage, '', '');

  modal.open();

  const handleFocus = () => {
    textarea.focus();
    modal.modalDialog.removeEventListener('transitionend', handleFocus);
  };

  modal.modalDialog.addEventListener('transitionend', handleFocus);
};

const closeModal = (modalElements) => {
  const { modal } = modalElements;
  modal.close();
};

const resetForm = (modalElements) => {
  const { textarea, clearButton, statusMessage, counter } = modalElements;

  textarea.value = '';
  textarea.focus();
  updateLocalSetting(CONFIG.SETTINGS_PATH.DRAFT_COMMENT, textarea.value);
  clearButton.classList.remove(`${CONFIG.CLASSES.CLEAR_BUTTON}--visible`);

  if (statusMessage) {
    setStatusMessage(statusMessage, '', '');
  }
  if (counter) {
    resetCounter(counter);
  }
};

const handleSubmitClick = async (modalElements, submitButton) => {
  const { modal, textarea, typeSelect, statusMessage } = modalElements;

  try {
    setStatusMessage(statusMessage, '', '');
    validateComment(textarea.value);

    submitButton.disabled = true;
    submitButton.textContent = CONFIG.TEXTS.PROCESSING;

    const result = await sendComment(typeSelect.value, textarea.value);

    if (result.success) {
      resetForm(modalElements);
      setStatusMessage(statusMessage, result.message, CLASSES.STATUS_SUCCESS);

      const reloadAfterComment = getLocalSetting(CONFIG.SETTINGS_PATH.RELOAD_AFTER_COMMENT);

      if (reloadAfterComment) {
        setTimeout(() => window.location.reload(), CONFIG.TIMEOUTS.MODAL_CLOSE);
        return;
      }

      setTimeout(() => modal.close(), CONFIG.TIMEOUTS.MODAL_CLOSE);
      return;
    }

    setStatusMessage(statusMessage, result.errors, CLASSES.STATUS_ERROR);
  } catch (error) {
    setStatusMessage(statusMessage, error.message || MESSAGES.ERROR_SENDING, CLASSES.STATUS_ERROR);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = CONFIG.TEXTS.SUBMIT;
  }
};

export { openModal, closeModal, resetForm, handleSubmitClick };
