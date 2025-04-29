/* eslint-disable no-alert */

import { isDealCreatePage, isCanbanDealsPage } from '../../../../utils/page-checker';

const CONSTANTS = {
  MESSAGES: {
    OFFER_REQUIRED: 'Для создания заказа необходимо добавить минимум одно предложение',
  },
  OLD_DEAL_CREATE: {
    SELECTORS: {
      OFFER_ID_FIELD: '[name="Position[0][offer_id]"]',
      ACTION_BUTTON: '[name="create"]',
    },
  },
  CANBAN_DEAL_CREATE: {
    SELECTORS: {
      FORM: '[aria-modal="true"] > .v-dialog > .task-form',
      ADD_OFFER_BUTTON: '.add-offer-button',
      ACTION_BUTTON: 'button[type="button"].mr-2',
    },
  },
};

const validateOldDealCreate = () => {
  const input = document.querySelector(CONSTANTS.OLD_DEAL_CREATE.SELECTORS.OFFER_ID_FIELD);
  const button = document.querySelector(CONSTANTS.OLD_DEAL_CREATE.SELECTORS.ACTION_BUTTON);

  button.addEventListener('click', (event) => {
    const hasNoValue = !input.hasAttribute('value') || input.getAttribute('value') === '';
    if (hasNoValue) {
      event.preventDefault();
      alert(CONSTANTS.MESSAGES.OFFER_REQUIRED);
    }
  });
};

const validateCanbanDealCreate = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList' || !mutation.addedNodes.length) {
        return;
      }

      const form = document.querySelector(CONSTANTS.CANBAN_DEAL_CREATE.SELECTORS.FORM);
      if (!form) {
        return;
      }

      const actionButton = form.querySelector(CONSTANTS.CANBAN_DEAL_CREATE.SELECTORS.ACTION_BUTTON);
      if (!actionButton || actionButton.dataset.handlerAdded) {
        return;
      }

      actionButton.dataset.handlerAdded = 'true';

      actionButton.addEventListener('mouseenter', () => {
        const hasOfferButton = !!form.querySelector(CONSTANTS.CANBAN_DEAL_CREATE.SELECTORS.ADD_OFFER_BUTTON);
        if (hasOfferButton) {
          alert(CONSTANTS.MESSAGES.OFFER_REQUIRED);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

const app = () => {
  if (isDealCreatePage) {
    validateOldDealCreate();
  }

  if (isCanbanDealsPage) {
    validateCanbanDealCreate();
  }
};

export default app;
