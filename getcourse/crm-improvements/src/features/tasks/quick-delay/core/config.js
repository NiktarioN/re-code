import { CSS_PREFIX } from '../../../../config/constants';

const CONFIG = {
  FEATURE_NAME: 'Быстрые варианты откладывания задачи',
  SECTION_TITLE: 'Быстрые варианты откладывания задачи',
  TEXTS: {
    USE_MOSCOW_TIME: 'Откладывать задачу относительно МСК',
    AUTO_NOTIFY: 'Поставить автонапоминание о задаче за',
  },
  CLASSES: {
    QUICK_DELAY: {
      SECTION: `${CSS_PREFIX}-quick-delay-section`,
      TITLE: `${CSS_PREFIX}-quick-delay-title`,
      SETTINGS: `${CSS_PREFIX}-quick-delay-settings`,
      OPTION: `${CSS_PREFIX}-quick-delay-option`,
      OPTIONS: `${CSS_PREFIX}-quick-delay-options`,
    },
    MOSCOW_TIME_CHECKBOX: `${CSS_PREFIX}-moscow-time-checkbox`,
    AUTO_NOTIFY: `${CSS_PREFIX}-auto-notify-checkbox`,
    AUTO_NOTIFY_DELAY: `${CSS_PREFIX}-auto-notify-delay`,
  },
  SELECTORS: {
    BLOCK: '.task-delayed-script',
    TIME_INPUT: '.script-time.time-input',
    SAVE_BUTTON: '.save-change-time',
    CHANGE_TIME_BLOCK: '.change-time-block',
    EXCLUDE_DELAYED_TASK_SCRIPT: '.active-task-script-delayedTaskScript',
    NOTIFY_DELAY_BUTTON: '.need-notify-link',
    NOTIFY_DELAY_SPAN: '.notify-delay',
    NOTIFY_DELAY_SCRIPT: '.script-notify-delay',
    NOTIFY_DELAY_VIEW_ELEMENT: '.notify-delay .view-elem',
    NOTIFY_DELAY_PARAMS: '.notification-params',
  },
  SETTINGS_PATH: {
    USE_MOSCOW_TIME: 'tasks.quickDelay.useMoscowTime',
    AUTO_NOTIFY_IS_ENABLED: 'tasks.autoNotify.isEnabled',
    AUTO_NOTIFY_MINUTES: 'tasks.autoNotify.minutes',
  },
  AUTO_NOTIFY: {
    MIN: 1,
    MAX: 59,
    DEFAULT_VALUE: 5,
  },
};

export default CONFIG;
