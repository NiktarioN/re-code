// @shared
export const CONFIG = {
  DEFAULT_ACTION_FIELD: 'Действие_по_задаче',
  DEFAULT_ACTION_VALUE: 'Контроль оплаты',
  INVOICE_DATE_FIELD: 'Дата_выставления_счет',
  FIELDS: {
    USER_TELEGRAM: 799909,
    PAYMENT_METHOD: 'Способ_оплаты_заказа',
    EXPECTED_PAYMENT_DATE: 'Дата_ожидаемой_оплаты',
  },
  IMPORTANT_ORDER_TAG: 'срм_ВАЖНО',
  MAX_OFFERS_LIMIT: 100,
  MANAGERS: [
    { id: 194639376, email: 'manager1@example.com', name: 'Менеджер 1' },
    { id: 440960268, email: 'manager2@example.com', name: 'Менеджер 2' },
  ],
};

export const MESSAGES = {
  OFFERS_LOAD_ERROR: 'Ошибка загрузки предложений',
  MANAGERS_LOAD_ERROR: 'Ошибка загрузки менеджеров',
  CONFIG_LOAD_ERROR: 'Ошибка загрузки конфигурации',
  CREATE_ORDER_ERROR: 'Ошибка создания заказа',
  USER_SEARCH_ERROR: 'Ошибка поиска пользователя',
  PAYMENT_METHODS_LOAD_ERROR: 'Ошибка загрузки способов оплаты',
  USER_ID_REQUIRED: 'User ID is required',
  USER_NOT_FOUND: 'User not found',
  ORDER_CREATION_FAILED: 'Ошибка создания заказа',
};