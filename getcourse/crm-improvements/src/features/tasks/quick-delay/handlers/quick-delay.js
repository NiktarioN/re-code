/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import CONFIG from '../core/config';
import { PLUGIN_NAME } from '../../../../config/constants';
import formatDate from '../core/formatters';
import { addMinutes, getUseMoscowTime } from '../core/time-utils';
import { handleAutoNotify } from './reminder-delay';

const handleTimeInputChange = (container) => {
  handleAutoNotify(container);
};

const setupQuickDelayHandler = (container, optionsContainer, timeInput) => {
  optionsContainer.addEventListener('click', (event) => {
    const optionElement = event.target.closest(`.${CONFIG.CLASSES.QUICK_DELAY.OPTION}`);
    if (!optionElement) {
      return;
    }

    const { minutes: rawMinutes } = optionElement.dataset;
    const minutes = Number(rawMinutes);

    if (!rawMinutes || Number.isNaN(minutes) || !timeInput) {
      return;
    }

    try {
      const useMoscowTime = getUseMoscowTime();
      const newDate = addMinutes(minutes, useMoscowTime);
      const formattedDate = formatDate(newDate);

      timeInput.value = formattedDate;
      timeInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

      const saveButton = container.querySelector(CONFIG.SELECTORS.SAVE_BUTTON);
      if (saveButton) {
        saveButton.style.display = '';
      }
    } catch (error) {
      console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка установки времени: `, error);
    }
  });

  timeInput.addEventListener('change', () => {
    handleTimeInputChange(container);
  });
};

export default setupQuickDelayHandler;
