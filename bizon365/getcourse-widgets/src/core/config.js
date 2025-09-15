export const CONFIG = {
  // Селекторы
  BANNER_CONTAINER_SELECTOR: '#banner0',
  FILES_CONTAINER_SELECTOR: '#files',

  // Настройки виджетов
  IFRAME_INITIAL_HEIGHT: '0px',
  WIDGET_TRIGGER_CLASS: 'recode-widget',
  WIDGET_BASE_NAME: 'getcourse-widget',

  // Таймауты и задержки
  SCROLL_DELAY: 300,
  SCROLL_ATTEMPT_INTERVAL: 200,
  HEIGHT_STABILITY_DELAY: 400,
  MUTATION_DEBOUNCE_DELAY: 150,
  CONTAINER_VISIBILITY_DEBOUNCE: 150,

  // Настройки скролла
  MAX_SCROLL_ATTEMPTS: 10,

  // Генерация случайных значений
  MIN_RANDOM_CLASS: 100,
  MAX_RANDOM_CLASS: 999,
  ID_LENGTH: 9,


  // Конфигурация MutationObserver
  OBSERVERS_CONFIG: {

    CONTAINERS: {
      attributes: true,
      attributeFilter: ['style'],
      childList: false,
      subtree: false,
    },

    ATTRIBUTES: {
      subtree: true,
      attributes: true,
      attributeFilter: ['href'],
    },

    CHILDLIST: {
      childList: true,
      subtree: true,
      attributes: false
    }
  },

  // Обязательные поля конфигурации виджетов
  REQUIRED_FIELDS: ['WIDGET_ID', 'WIDGET_SRC', 'ACTION_ELEMENT_SELECTOR'],
};
