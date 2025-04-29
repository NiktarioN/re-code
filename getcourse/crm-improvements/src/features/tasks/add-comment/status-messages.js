/* eslint-disable no-param-reassign */

import { CONFIG } from "./config";

const setStatusMessage = (element, text, typeClass = '') => {
  element.textContent = text;
  element.className = CONFIG.CLASSES.STATUS_MESSAGE;

  if (typeClass) {
    element.classList.add(typeClass);
  }
};

export default setStatusMessage
