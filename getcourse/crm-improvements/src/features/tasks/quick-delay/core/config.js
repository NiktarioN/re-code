import { CSS_PREFIX } from '../../../../config/constants';

const CONFIG = {
  FEATURE_NAME: 'Быстрые варианты откладывания задачи',
  SECTION_TITLE: 'Быстрые варианты откладывания задачи',
  TEXTS: {
    USE_MOSCOW_TIME: 'Откладывать задачу относительно МСК',
  },
  CLASSES: {
    QUICK_DELAY: {
      SECTION: `${CSS_PREFIX}-quick-delay-section`,
      TITLE: `${CSS_PREFIX}-quick-delay-title`,
      OPTION: `${CSS_PREFIX}-quick-delay-option`,
      OPTIONS: `${CSS_PREFIX}-quick-delay-options`,
    },
    MOSCOW_TIME_CHECKBOX: `${CSS_PREFIX}-moscow-time-checkbox`,
  },
  SELECTORS: {
    BLOCK: '.task-delayed-script',
    TIME_INPUT: '.script-time.time-input',
    SAVE_BUTTON: '.save-change-time',
    CHANGE_TIME_BLOCK: '.change-time-block',
    EXCLUDE_DELAYED_TASK_SCRIPT: '.active-task-script-delayedTaskScript',
  },
  SETTINGS_PATH: {
    USE_MOSCOW_TIME: 'tasks.quickDelay.useMoscowTime',

  },
};

export default CONFIG;
