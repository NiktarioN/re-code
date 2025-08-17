import CONFIG from '../core/config';
import { PLUGIN_NAME } from '../../../../config/constants';
import createDelaySection from './components/quick-delay-section';

const renderQuickDelayUI = (form) => {
  try {
    const existingSection = form.querySelector(`.${CONFIG.CLASSES.QUICK_DELAY.SECTION}`);
    if (existingSection) {
      return false;
    }

    const timeInput = form.querySelector(
      `.active-task-script:not(${CONFIG.SELECTORS.EXCLUDE_DELAYED_TASK_SCRIPT}) ${CONFIG.SELECTORS.TIME_INPUT}`
    );
    if (!timeInput) {
      return false;
    }

    const { delaySection, moscowCheckbox, autoNotifyCheckbox, autoNotifyInput, delayOptions } = createDelaySection();

    const timeBlock = form.querySelector(
      `.active-task-script:not(${CONFIG.SELECTORS.EXCLUDE_DELAYED_TASK_SCRIPT}) ${CONFIG.SELECTORS.CHANGE_TIME_BLOCK}`
    );

    if (timeBlock) {
      timeBlock.prepend(delaySection);
    } else {
      form.appendChild(delaySection);
    }

    return {
      timeInput,
      delaySection,
      moscowCheckbox,
      autoNotifyCheckbox,
      autoNotifyInput,
      delayOptions,
    };
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка отрисовки UI: `, error);
    return false;
  }
};

export default renderQuickDelayUI;
