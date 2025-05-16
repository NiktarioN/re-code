/* eslint-disable no-param-reassign */

import CONFIG from '../core/config';
import { PLUGIN_NAME } from '../../../../config/constants';
import formatDate from '../core/formatters';
import { addMinutes, getUseMoscowTime } from '../core/time-utils';

const quickDelayHandler = (optionsContainer, timeInput) => {
  optionsContainer.addEventListener('click', (event) => {
    const optionElement = event.target.closest(`.${CONFIG.CLASSES.QUICK_DELAY.OPTION}`);
    if (!optionElement) {
      return;
    }

    const { minutes: rawMinutes } = optionElement.dataset;
    if (!rawMinutes || !timeInput) {
      return;
    }

    const minutes = Number(rawMinutes);
    if (Number.isNaN(minutes)) {
      return;
    }

    try {
      const useMoscowTime = getUseMoscowTime();
      timeInput.value = formatDate(addMinutes(minutes, useMoscowTime));

      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      timeInput.dispatchEvent(changeEvent);

      const saveButton = timeInput.closest(CONFIG.SELECTORS.BLOCK)?.querySelector(CONFIG.SELECTORS.SAVE_BUTTON);
      if (saveButton) {
        saveButton.style.display = '';
      }
    } catch (error) {
      console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка установки времени:`, error);
    }
  });
};

export default quickDelayHandler;
