import CONFIG from '../core/config';
import { PLUGIN_NAME } from '../../../../config/constants';
import { getLocalSetting } from '../../../../modules/local-settings-manager';

const setReminderDelay = (container, minutes) => {
  try {
    const input = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_SCRIPT);
    if (!input) {
      return;
    }

    const notifyValue = {
      parts: {
        days: 0,
        hours: 0,
        minutes,
      },
    };

    input.value = JSON.stringify(notifyValue);

    const viewElement = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_VIEW_ELEMENT);
    if (viewElement) {
      viewElement.textContent = `${minutes} мин.`;
    }
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка установки напоминания: `, error);
  }
};

const resetReminderDelay = (container) => {
  try {
    const input = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_SCRIPT);
    if (!input) {
      return
    }

    input.value = JSON.stringify({ parts: { days: '', hours: '', minutes: '' } });

    const viewElement = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_VIEW_ELEMENT);
    if (viewElement) {
      viewElement.textContent = 'не указано';
    }

  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка сброса напоминания: `, error);
  }
};

const waitForNotifyField = (container, callback) => {
  const observer = new MutationObserver(() => {
    const view = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_SPAN);
    if (view) {
      observer.disconnect();
      callback();
    }
  });

  observer.observe(container, { childList: true, subtree: true });
};

const waitForNotifyButton = (container, callback) => {
  const notifyLink = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_BUTTON);
  if (notifyLink) {
    callback(notifyLink);
  }

  const observer = new MutationObserver(() => {
    const link = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_BUTTON);
    if (link) {
      observer.disconnect();
      callback(link);
    }
  });

  observer.observe(container, { childList: true, subtree: true });
};

const validateNotifyMinutes = (minutes) => {
  const parsedMinutes = Number(minutes);

  if (Number.isNaN(parsedMinutes)) {
    throw new Error('Некорректное значение минут у времени напоминания о задаче');
  }

  if (parsedMinutes < CONFIG.AUTO_NOTIFY.MIN || parsedMinutes > CONFIG.AUTO_NOTIFY.MAX) {
    throw new Error(`Значение должно быть от ${CONFIG.AUTO_NOTIFY.MIN} до ${CONFIG.AUTO_NOTIFY.MAX} минут`);
  }

  return parsedMinutes;
};

const handleAutoNotify = (container) => {
  if (!container) {
    return;
  }

  const autoNotifyEnabled = getLocalSetting(CONFIG.SETTINGS_PATH.AUTO_NOTIFY_IS_ENABLED);
  if (!autoNotifyEnabled) {
    resetReminderDelay(container);
    return;
  }

  const delayInput = container.querySelector(`.${CONFIG.CLASSES.AUTO_NOTIFY_DELAY}`);
  const notifyLink = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_BUTTON);
  const notificationParams = container.querySelector(CONFIG.SELECTORS.NOTIFY_DELAY_PARAMS);

  try {
    const notifyMinutes = validateNotifyMinutes(delayInput.value);

    if (!notificationParams) {
      return;
    }

    const isNotifocationParamsHidden = getComputedStyle(notificationParams).display === 'none';
    if (isNotifocationParamsHidden) {
      notifyLink.click();

      waitForNotifyField(container, () => {
        setReminderDelay(container, notifyMinutes);
      });
    } else {
      setReminderDelay(container, notifyMinutes);
    }
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка автонапоминания:`, error);
    alert(error.message);
  }
};

export { setReminderDelay, resetReminderDelay, waitForNotifyField, validateNotifyMinutes, handleAutoNotify };
