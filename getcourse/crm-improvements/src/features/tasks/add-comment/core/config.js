import { PROJECT_NAME, CSS_PREFIX } from '../../../../config/constants';

const CONFIG = {
  FEATURE_NAME: 'Система комментариев в задачах',
  CLASSES: {
    ACTIONS_CONTAINER: `${CSS_PREFIX}-actions-container`,
    ADD_COMMENT_BUTTON: `${CSS_PREFIX}-add-comment-button`,
    COMMENT_ICON: 'fa-regular fa-comment',
    COMMENT_CLEAR_ICON: 'fa fa-trash',
    MODAL_CONTENT: `${CSS_PREFIX}-modal-content`,
    MODAL_HEADER: `${CSS_PREFIX}-modal-header`,
    MODAL_BODY: `${CSS_PREFIX}-modal-body`,
    MODAL_FOOTER: `${CSS_PREFIX}-modal-footer`,
    MODAL_FOOTER_BTN: `${CSS_PREFIX}-modal-footer__btn`,
    COMMENT_TYPE: `${CSS_PREFIX}-comment-type`,
    COMMENT_TEXT: `${CSS_PREFIX}-comment-text`,
    CLEAR_BUTTON: `${CSS_PREFIX}-comment-clear-btn`,
    BTN_CANCEL: `${CSS_PREFIX}-btn-cancel`,
    BTN_SUBMIT: `${CSS_PREFIX}-btn-submit`,
    STATUS_MESSAGE: `${CSS_PREFIX}-status-message`,
    CHAR_COUNTER: `${CSS_PREFIX}-char-counter`,
  },
  TEXTS: {
    HEADER: 'Добавить комментарий',
    CANCEL: 'Закрыть',
    SUBMIT: 'Добавить',
    CLEAR: 'Очистить поле',
    PROCESSING: 'Отправка...',
    SUCCESS: 'Комментарий успешно добавлен',
    ERROR: 'Ошибка при добавлении комментария',
    PLACEHOLDER: 'Введите комментарий...',
    COMMENT_BUTTON: 'Написать комментарий',
    RELOAD_AFTER_COMMENT: 'Перезагружать страницу после добавления комментария',
  },
  SETTINGS_PATH: {
    DRAFT_COMMENT: 'tasks.draftComment',
    RELOAD_AFTER_COMMENT: 'tasks.reloadAfterComment'
  },
  API_ENDPOINT: '/chtm/re-code/comments-module',
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
  ERROR_COMMENT_TOO_LONG: (max) =>
    `Комментарий не может быть длиннее ${max} символов. Сократите его или разделите на несколько`,
  ERROR_MISSING_ID: (type) => `Не удалось определить ID ${type === 'deal' ? 'заказа' : 'пользователя'}`,
  ERROR_SENDING: 'Ошибка при добавлении комментария',
  ERROR_404: `В аккаунте не подключен плагин «${CONFIG.FEATURE_NAME}» от проекта «${PROJECT_NAME}»`
};

export { CONFIG, MESSAGES };
