/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */

import { isDealCreatePage, isCanbanDealsPage } from '../../../../utils/page-checker';
import { validateOfferAddInput } from '../../../../utils/validate';

const CONFIG = {
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

const MESSAGES = {
  OFFER_REQUIRED: 'Для создания заказа необходимо выбрать минимум одно предложение',
};

const validateOldDealCreate = () => {
  const input = document.querySelector(CONFIG.OLD_DEAL_CREATE.SELECTORS.OFFER_ID_FIELD);
  const button = document.querySelector(CONFIG.OLD_DEAL_CREATE.SELECTORS.ACTION_BUTTON);

  if (!input || !button) {
    return;
  }

  button.addEventListener('click', (event) => {
    const offers = validateOfferAddInput(input);
    if (!offers.length) {
      event.preventDefault();
      alert(MESSAGES.OFFER_REQUIRED);
    }
  });
};

const validateCanbanDealCreate = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList' || !mutation.addedNodes.length) {
        return;
      }

      const form = document.querySelector(CONFIG.CANBAN_DEAL_CREATE.SELECTORS.FORM);
      if (!form) {
        return;
      }

      const actionButton = form.querySelector(CONFIG.CANBAN_DEAL_CREATE.SELECTORS.ACTION_BUTTON);
      if (!actionButton || actionButton.dataset.handlerAdded) {
        return;
      }

      actionButton.dataset.handlerAdded = 'true';

      actionButton.addEventListener('mouseenter', () => {
        const hasOfferButton = !!form.querySelector(CONFIG.CANBAN_DEAL_CREATE.SELECTORS.ADD_OFFER_BUTTON);
        if (hasOfferButton) {
          alert(MESSAGES.OFFER_REQUIRED);
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
