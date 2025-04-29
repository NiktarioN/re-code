/* eslint-disable no-param-reassign */

import { PLUGIN_NAME, CSS_PREFIX } from '../../config/constants';

const CONFIG = {
  FEATURE_NAME: 'Блокировка повторного нажатия кнопок в задаче',
  SELECTORS: {
    RESULTS_BLOCK: '.results-block',
    BUTTON: 'button[type="submit"]',
  },
  CLASSES: {
    DISABLED: `${CSS_PREFIX}-disabled`,
  },
  DISABLE_DURATION: 10000,
};

const blockButtons = (resultsBlock) => {
  const buttons = resultsBlock.querySelectorAll(CONFIG.SELECTORS.BUTTON);
  buttons.forEach(button => {
    button.classList.add(CONFIG.CLASSES.DISABLED);
    button.style.pointerEvents = 'none';
  });
};

const unblockButtons = (resultsBlock) => {
  const buttons = resultsBlock.querySelectorAll(CONFIG.SELECTORS.BUTTON);
  buttons.forEach(button => {
    button.classList.remove(CONFIG.CLASSES.DISABLED);
    button.style.pointerEvents = 'auto';
  });
};

const handleDocumentClick = (event) => {
  try {
    const button = event.target.closest(CONFIG.SELECTORS.BUTTON);
    if (!button) {
      return;
    }

    const resultsBlock = button.closest(CONFIG.SELECTORS.RESULTS_BLOCK);
    if (!resultsBlock) {
      return;
    }

    if (button.classList.contains(CONFIG.CLASSES.DISABLED)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    blockButtons(resultsBlock);

    setTimeout(() => {
      unblockButtons(resultsBlock);
    }, CONFIG.DISABLE_DURATION);

  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка обработки клика: `, error);
  }
};

const init = () => {
  document.addEventListener('click', handleDocumentClick);
};

export default init;
