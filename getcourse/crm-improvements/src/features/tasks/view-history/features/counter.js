/* eslint-disable no-param-reassign */

import { CLASSES } from '../../../../config/constants';
import { CONFIG } from '../core/config';

const updateCounter = (textarea, clearButton, counter) => {
  const { length } = textarea.value;
  const maxLength = CONFIG.VALIDATION.MAX_LENGTH;

  if (counter) {
    counter.textContent = `${length}/${maxLength}`;
    const isError = length > maxLength;
    counter.classList.toggle(CLASSES.STATUS_ERROR, isError);
  }

  clearButton.classList.toggle(`${CONFIG.CLASSES.CLEAR_BUTTON}--visible`, length);
};

const resetCounter = (counter) => {
  counter.textContent = `0/${CONFIG.VALIDATION.MAX_LENGTH}`;
  counter.classList.remove(CLASSES.STATUS_ERROR);
};

const setupCharCounter = (textarea, clearButton, counter) => {
  const handleInput = () => {
    updateCounter(textarea, clearButton, counter);
  };

  textarea.addEventListener('input', handleInput);
  textarea.addEventListener('paste', handleInput);

  updateCounter(textarea, clearButton, counter);
};

export { updateCounter, resetCounter, setupCharCounter };