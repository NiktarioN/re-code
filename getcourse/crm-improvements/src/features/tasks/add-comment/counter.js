/* eslint-disable no-param-reassign */

import { CONFIG } from "./config";

const updateCounter = (textarea, counter) => {
  const { length } = textarea.value;
  counter.textContent = `${length}/${CONFIG.VALIDATION.MAX_LENGTH}`;

  counter.classList.toggle(CONFIG.CLASSES.CHAR_COUNTER_ERROR, length > CONFIG.VALIDATION.MAX_LENGTH);
};

const resetCounter = (counter) => {
  counter.textContent = `0/${CONFIG.VALIDATION.MAX_LENGTH}`;
  counter.classList.remove(CONFIG.CLASSES.CHAR_COUNTER_ERROR);
}

export { updateCounter, resetCounter };