export const CONFIG = {
  FEATURE_NAME: 'Валидация настроек предложений',
  SELECTORS: {
    ACTION_BUTTONS: '.save-offer, .copy-offer',
    TAGS_CONTAINER: '.gc-tags',
    NO_TAGS_MARKER: '.no-tags',
    TAGS_INPUTS: '[name="Offer[tags][]"]',
    CANCEL_REASON: '[name="ParamsObject[cancel_reason_id]"]',
    OFFER_PRICE: '[name="Offer[price]"]',
    OFFER_CODE_FIELD: '[name="Offer[code]"]',
    SEND_ADMIN_MESSAGE: '[name="ParamsObject[send_admin_message]"]',
    SEND_USER_MESSAGE: '[name="ParamsObject[send_message]"]',
  },
  TAG_SEPARATOR: '_',
  VALIDATION_MODES: {
    ON_LOAD: 'onLoad',
    ON_ACTION: 'onAction',
  },
};