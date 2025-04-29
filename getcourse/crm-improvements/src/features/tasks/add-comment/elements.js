import { CONFIG } from './config';
import { createElement } from '../../../../../../utils/dom';

const createCommentButton = () => createElement('button', {
  class: CONFIG.CLASSES.ADD_COMMENT_BUTTON,
  type: 'button',
  html: `<i class="${CONFIG.CLASSES.COMMENT_ICON}"></i><span>Написать комментарий</span>`,
});

const createModalHeader = () => createElement('div', {
  class: CONFIG.CLASSES.MODAL_HEADER,
  html: `<h3>${CONFIG.TEXTS.HEADER}</h3>`,
});

const createModalBody = () => {
  const typeSelect = createElement('select', {
    class: CONFIG.CLASSES.COMMENT_TYPE,
    html: `
      <option value="deal">В карточку заказа</option>
      <option value="user">В ленту пользователя</option>
    `
  });

  const textarea = createElement('textarea', {
    class: CONFIG.CLASSES.COMMENT_TEXT,
    placeholder: CONFIG.TEXTS.PLACEHOLDER,
    maxLength: CONFIG.VALIDATION.MAX_LENGTH,
  });

  const counter = createElement('div', {
    class: CONFIG.CLASSES.CHAR_COUNTER,
    textContent: `0/${CONFIG.VALIDATION.MAX_LENGTH}`
  });

  const statusMessage = createElement('div', {
    class: CONFIG.CLASSES.STATUS_MESSAGE,
  });

  return { typeSelect, textarea, counter, statusMessage };
};

const createModalFooter = () => {
  const cancelButton = createElement('button', {
    class: CONFIG.CLASSES.BTN_CANCEL,
    type: 'button',
    textContent: CONFIG.TEXTS.CANCEL,
  });

  const submitButton = createElement('button', {
    class: CONFIG.CLASSES.BTN_SUBMIT,
    type: 'button',
    textContent: CONFIG.TEXTS.SUBMIT,
  });

  return { cancelButton, submitButton };
}

export { createCommentButton, createModalHeader, createModalBody, createModalFooter }
