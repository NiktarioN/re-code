/* eslint-disable no-param-reassign */

import { CONFIG, MESSAGES } from './config';
import Modal from '../../../modules/modal';
import { createCommentButton, createModalHeader, createModalBody, createModalFooter } from './elements';
import sendComment from './comments';
import { updateCounter } from './counter';
import setStatusMessage from './status-messages';
import { openModal, closeModal, resetForm } from './modal-handlers';
import { createElement } from '../../../../../../utils/dom';

const setupCharCounter = (textarea, counter) => {
  textarea.addEventListener('input', () => { updateCounter(textarea, counter); });

  updateCounter(textarea, counter);
};

const buildModalElements = () => {
  const modal = new Modal();
  const modalHeader = createModalHeader();
  const modalBody = createElement('div', { class: CONFIG.CLASSES.MODAL_BODY });
  const { typeSelect, textarea, counter, statusMessage } = createModalBody();
  const { cancelButton, submitButton } = createModalFooter();
  const modalFooter = createElement('div', { class: CONFIG.CLASSES.MODAL_FOOTER });

  modalBody.append(typeSelect, textarea, counter, statusMessage);
  modalFooter.append(cancelButton, submitButton);

  const fragment = document.createDocumentFragment();
  fragment.append(modalHeader, modalBody, modalFooter);
  modal.setContent(fragment);

  return { modal, typeSelect, textarea, counter, statusMessage, cancelButton, submitButton };
};

const initCommentSystem = (formElement) => {
  if (!formElement || formElement.querySelector(`.${CONFIG.CLASSES.ADD_COMMENT_BUTTON}`)) {
    return;
  }

  const { modal, typeSelect, textarea, counter, statusMessage, cancelButton, submitButton } = buildModalElements();

  const button = createCommentButton();
  const container = createElement('div', { class: `${CONFIG.CLASSES.ACTIONS_CONTAINER}` });
  container.append(button);
  formElement.append(container);

  const modalElements = { modal, textarea, typeSelect, counter, statusMessage };

  setupCharCounter(textarea, counter);

  button.addEventListener('click', () => openModal(modalElements));
  cancelButton.addEventListener('click', () => closeModal(modalElements));

  submitButton.addEventListener('click', async () => {
    setStatusMessage(statusMessage, '', '');

    try {
      submitButton.disabled = true;
      submitButton.textContent = CONFIG.TEXTS.PROCESSING;

      await sendComment(typeSelect.value, textarea.value);

      resetForm(modalElements);

      setStatusMessage(statusMessage, CONFIG.TEXTS.SUCCESS, CONFIG.CLASSES.STATUS_SUCCESS);

      setTimeout(() => modal.close(), CONFIG.TIMEOUTS.MODAL_CLOSE);
    } catch (error) {
      setStatusMessage(statusMessage, error.message || MESSAGES.ERROR_SENDING, CONFIG.CLASSES.STATUS_ERROR);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = CONFIG.TEXTS.SUBMIT;
    }
  });
};

const init = (forms) => {
  forms.forEach((form) => {
    const taskObject = form.querySelector('.task-object');
    if (taskObject) {
      initCommentSystem(taskObject);
    }
  });
};

export default init;
