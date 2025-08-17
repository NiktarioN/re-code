import { SelectorJS } from '../../../../../../utils/selector-js';

import { messageWithProjectNameShort } from '../../../common/messages';

import { CONFIG } from '../core/config';
import { createValidationResult } from '../common/validation-result';

const createMessageValidator = (selector, errorMessage) => (config) => {
  const { defaultValue, mode, offerPrice } = config;

  if (mode === 'free-offers' && offerPrice > 0) {
    return createValidationResult(true);
  }

  try {
    const messageSelect = new SelectorJS(selector);
    messageSelect.value = defaultValue;

    return messageSelect.value === defaultValue ? createValidationResult(true) : createValidationResult(false);
  } catch (error) {
    console.error(messageWithProjectNameShort(errorMessage), error);
    return createValidationResult(false);
  }
};

export const validateSendAdminMessage = createMessageValidator(
  CONFIG.SELECTORS.SEND_ADMIN_MESSAGE,
  'Ошибка при валидации отправки сообщения администратору:'
);

export const validateSendUserMessage = createMessageValidator(
  CONFIG.SELECTORS.SEND_USER_MESSAGE,
  'Ошибка при валидации отправки сообщения пользователю:'
);