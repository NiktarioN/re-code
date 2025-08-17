/* eslint-disable no-alert */

import { isOneOfferSettingsPage } from '../../../../utils/page-checker';

import { GLOBAL_CONFIG } from '../../config/config';
import { notificationSystem } from '../../modules/notification-system';
import { messageWithProjectNameShort } from '../../common/messages';

import { CONFIG } from './core/config';
import { validateOfferSettings } from './core/validator';

const handleValidationError = (errorMessage) => {
  notificationSystem.error(errorMessage, {
    title: 'Ошибки валидации'
  });
};

const handleActionClick = (event, config) => {
  const { isValid, errorMessage } = validateOfferSettings(config, CONFIG.VALIDATION_MODES.ON_ACTION);

  if (!isValid) {
    event.preventDefault();
    event.stopPropagation();
    handleValidationError(errorMessage);
  }
};

const attachActionHandlers = (config) => {
  const buttons = document.querySelectorAll(CONFIG.SELECTORS.ACTION_BUTTONS);

  if (!buttons.length) {
    console.warn(messageWithProjectNameShort('Кнопки действий не найдены'));
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => handleActionClick(event, config));
  });
};

const performInitialValidation = (config) => {
  const { isValid, errorMessage } = validateOfferSettings(
    config,
    CONFIG.VALIDATION_MODES.ON_LOAD
  );

  if (!isValid) {
    notificationSystem.warning(errorMessage, {
      title: 'Предупреждения валидации'
    });
  }
};

export const initOfferSettingsValidation = () => {
  if (!isOneOfferSettingsPage) {
    return;
  }

  const config = GLOBAL_CONFIG.validateOfferSettings;

  if (!config) {
    console.error(messageWithProjectNameShort('Конфигурация валидации не найдена'));
    return;
  }

  if (!config.isEnabled) {
    return;
  }

  performInitialValidation(config);
  attachActionHandlers(config);
};
