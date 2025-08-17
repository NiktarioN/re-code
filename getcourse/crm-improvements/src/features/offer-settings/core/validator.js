import { getOfferPrice } from '../../../../../utils/offer-settings/gets';

import { messageWithProjectNameShort } from '../../../common/messages';

import { CONFIG } from './config';
import { validateCancelReason } from '../features/cancel-reason';
import { validateTags } from '../features/tags';
import { validateOfferCode } from '../features/offer-code'
import { validateSendAdminMessage, validateSendUserMessage } from '../features/send-message';

const formatErrors = (errors) => {
  if (!errors.length) {
    return null;
  }

  const formattedErrors = errors.map((error, index) => `${index + 1}. ${error}`).join('\n');

  return `Необходимо исправить ошибки в настройках\n\n${formattedErrors}`;
};

const VALIDATORS = Object.freeze({
  tags: {
    validate: (config) => validateTags(config),
    modes: [CONFIG.VALIDATION_MODES.ON_ACTION],
  },
  cancelReason: {
    validate: (config) => validateCancelReason(config),
    modes: [CONFIG.VALIDATION_MODES.ON_LOAD, CONFIG.VALIDATION_MODES.ON_ACTION],
  },
  offerCode: {
    validate: (config) => validateOfferCode(config),
    modes: [CONFIG.VALIDATION_MODES.ON_LOAD, CONFIG.VALIDATION_MODES.ON_ACTION],
  },
  sendAdminMessage: {
    validate: validateSendAdminMessage,
    modes: [CONFIG.VALIDATION_MODES.ON_LOAD, CONFIG.VALIDATION_MODES.ON_ACTION],
  },
  sendUserMessage: {
    validate: validateSendUserMessage,
    modes: [CONFIG.VALIDATION_MODES.ON_LOAD, CONFIG.VALIDATION_MODES.ON_ACTION],
  },
});

const executeValidation = (validator, config, key) => {
  try {
    const result = validator.validate(config);
    return result.success ? null : result.message;
  } catch (error) {
    console.error(messageWithProjectNameShort(`Ошибка при валидации (${key}):`), error);
    return `Внутренняя ошибка валидации: ${key}`;
  }
};

const getValidationErrors = (config, mode) => {
  const offerPrice = getOfferPrice();

  return Object.entries(VALIDATORS)
    .filter(([key, validator]) => {
      const featureConfig = config[key];
      return featureConfig?.isEnabled && validator.modes.includes(mode);
    })
    .map(([key, validator]) => {
      const featureConfig = config[key];
      const validationConfig = { ...featureConfig, offerPrice };
      return executeValidation(validator, validationConfig, key);
    })
    .filter(Boolean);
};

export const validateOfferSettings = (config, mode) => {
  const errors = getValidationErrors(config, mode);

  return {
    isValid: errors.length === 0,
    errorMessage: formatErrors(errors),
  };
};
