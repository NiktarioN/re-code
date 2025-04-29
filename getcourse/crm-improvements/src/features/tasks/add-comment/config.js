import { CSS_PREFIX } from '../../../config/constants';

const CONFIG = {
  FEATURE_NAME: 'Система комментариев в задачах',
  CLASSES: {
    ACTIONS_CONTAINER: `${CSS_PREFIX}-actions-container`,
    ADD_COMMENT_BUTTON: `${CSS_PREFIX}-add-comment-button`,
    COMMENT_ICON: 'fa-regular fa-comment',
    MODAL_CONTENT: `${CSS_PREFIX}-modal-content`,
    MODAL_HEADER: `${CSS_PREFIX}-modal-header`,
    MODAL_BODY: `${CSS_PREFIX}-modal-body`,
    MODAL_FOOTER: `${CSS_PREFIX}-modal-footer`,
    COMMENT_TYPE: `${CSS_PREFIX}-comment-type`,
    COMMENT_TEXT: `${CSS_PREFIX}-comment-text`,
    BTN_CANCEL: `${CSS_PREFIX}-btn-cancel`,
    BTN_SUBMIT: `${CSS_PREFIX}-btn-submit`,
    STATUS_MESSAGE: `${CSS_PREFIX}-status-message`,
    STATUS_SUCCESS: `${CSS_PREFIX}-status-success`,
    STATUS_ERROR: `${CSS_PREFIX}-status-error`,
    CHAR_COUNTER: `${CSS_PREFIX}-char-counter`,
    CHAR_COUNTER_ERROR: `${CSS_PREFIX}-char-counter-error`,
  },
  TEXTS: {
    HEADER: 'Добавить комментарий',
    CANCEL: 'Закрыть',
    SUBMIT: 'Добавить',
    PROCESSING: 'Отправка...',
    SUCCESS: 'Комментарий успешно добавлен',
    ERROR: 'Ошибка при добавлении комментария',
    PLACEHOLDER: 'Введите комментарий...',
  },
  API_ENDPOINTS: {
    DEAL_COMMENT: '/api/comment/deal',
    USER_COMMENT: '/api/comment/user',
  },
  VALIDATION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
  TIMEOUTS: {
    MODAL_CLOSE: 1500,
  },
};

const MESSAGES = {
  ERROR_EMPTY_COMMENT: 'Комментарий не может быть пустым',
  ERROR_COMMENT_TOO_LONG: (max) => `Комментарий не может быть длиннее ${max} символов`,
  ERROR_SENDING: 'Ошибка при добавлении комментария',
  ERROR_MISSING_ID: (type) => `Не удалось определить ID ${type === 'deal' ? 'заказа' : 'пользователя'}`,
}

export { CONFIG, MESSAGES };