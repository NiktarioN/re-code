import { PROJECT_NAME_SHORT, PROJECT_LINK, CLASSES } from '../../../../config/constants';
import { GLOBAL_CONFIG } from '../../../../config/config';
import { CONFIG } from '../core/config';
import { createElement } from '../../../../../../../utils/dom';
import Modal from '../../../../modules/modal';

const createModalHeader = () =>
  createElement('div', {
    class: CONFIG.CLASSES.MODAL_HEADER,
    html: `
      <a href="${PROJECT_LINK}" target="_blank">${PROJECT_NAME_SHORT}</a>
      <h3>${CONFIG.TEXTS.HEADER}</h3>
    `,
  });

const createModalBody = (taskObject) => {
  const body = createElement('div', { class: CONFIG.CLASSES.MODAL_BODY });

  const typeSelect = createElement('select', {
    class: CONFIG.CLASSES.COMMENT_TYPE,
    html: `
      ${taskObject === 'deal' ? '<option value="deal" selected>В заказ</option>' : ''}
      <option value="user" ${taskObject === 'user' ? 'selected' : ''}>В пользователя</option>
    `,
  });

  const textarea = createElement('textarea', {
    class: CONFIG.CLASSES.COMMENT_TEXT,
    placeholder: CONFIG.TEXTS.PLACEHOLDER,
  });

  const createCounter = () => {
    if (GLOBAL_CONFIG.tasks.comments.enableCommentLimit) {
      return createElement('div', {
        class: CONFIG.CLASSES.CHAR_COUNTER,
        textContent: `0/${CONFIG.VALIDATION.MAX_LENGTH}`,
      });
    }
    return '';
  }

  const counter = createCounter();

  const statusMessage = createElement('div', {
    class: CONFIG.CLASSES.STATUS_MESSAGE,
  });

  const reloadCheckboxWrapper = createElement('div', { class: CLASSES.CHECKBOX_WRAPPER });
  const reloadCheckboxLabel = createElement('label', { textContent: CONFIG.TEXTS.RELOAD_AFTER_COMMENT });
  const reloadCheckboxInput = createElement('input', { type: 'checkbox' });

  reloadCheckboxLabel.prepend(reloadCheckboxInput);
  reloadCheckboxWrapper.append(reloadCheckboxLabel);
  body.append(typeSelect, textarea, counter, statusMessage, reloadCheckboxWrapper);

  return { body, typeSelect, textarea, counter, statusMessage, reloadCheckboxInput, reloadCheckboxWrapper };
};

const createModalFooter = () => {
  const footer = createElement('div', { class: CONFIG.CLASSES.MODAL_FOOTER });

  const cancelButton = createElement('button', {
    class: `${CONFIG.CLASSES.MODAL_FOOTER_BTN} ${CONFIG.CLASSES.BTN_CANCEL}`,
    type: 'button',
    textContent: CONFIG.TEXTS.CANCEL,
  });

  const submitButton = createElement('button', {
    class: `${CONFIG.CLASSES.MODAL_FOOTER_BTN} ${CONFIG.CLASSES.BTN_SUBMIT}`,
    type: 'button',
    textContent: CONFIG.TEXTS.SUBMIT,
  });

  const clearButton = createElement('button', {
    class: `${CONFIG.CLASSES.CLEAR_BUTTON}`,
    type: 'button',
    html: `
    <i class="${CONFIG.CLASSES.COMMENT_CLEAR_ICON}"></i><span> ${CONFIG.TEXTS.CLEAR}</span>`,
  });

  footer.append(clearButton, cancelButton, submitButton);

  return { footer, clearButton, cancelButton, submitButton };
};

const buildModalElements = (taskObject) => {
  const modal = new Modal();

  const header = createModalHeader();
  const { body, typeSelect, textarea, counter, statusMessage, reloadCheckboxInput, reloadCheckboxWrapper } = createModalBody(taskObject);
  const { footer, clearButton, cancelButton, submitButton } = createModalFooter();

  const fragment = document.createDocumentFragment();
  fragment.append(header, body, footer);

  modal.setContent(fragment);

  return {
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
  };
};

export default buildModalElements;
