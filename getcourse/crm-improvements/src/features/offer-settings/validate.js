/* eslint-disable no-alert */

import settings from '../../config/settings';
import { isOneOfferSettingsPage } from '../../../../utils/page-checker';

const CONFIG = {
  SELECTORS: {
    ACTION_BUTTONS: '.save-offer, .copy-offer',
    TAGS_CONTAINER: '.gc-tags',
    NO_TAGS_MARKER: '.no-tags',
  },

  MESSAGES: {
    NO_TAGS: 'Нельзя сохранить настройки/копировать предложение, если у него не указаны теги. Поставьте хотя бы 1 тег',
  },
};

const hasTags = (tagsContainer) => !tagsContainer.querySelector(CONFIG.SELECTORS.NO_TAGS_MARKER);

const handleSaveAttempt = (event, tagsContainer) => {
  if (hasTags(tagsContainer)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  alert(CONFIG.MESSAGES.NO_TAGS);
};

const app = (config) => {
  if (!isOneOfferSettingsPage) {
    return;
  }

  const validateTags = config.tags || settings.validateOfferSettings.tags;

  const actionButtons = document.querySelectorAll(CONFIG.SELECTORS.ACTION_BUTTONS);
  if (!actionButtons.length) {
    return;
  }

  if (validateTags) {
    const tagsContainer = document.querySelector(CONFIG.SELECTORS.TAGS_CONTAINER);
    const clickHandler = (event) => handleSaveAttempt(event, tagsContainer);
    actionButtons.forEach((button) => {
      button.addEventListener('click', clickHandler);
    });
  }
};

export default app;
