/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */

import CONFIG from './core/config';
import MESSAGES from './core/messages';
import { validateOfferSelection } from '../../../../../utils/validate';
import TaskButtonsManager from '../common/buttons-manager';
import registerEnhancement from '../common/register-enhancement';

const validateAndUpdateButtons = (offerField, successButtons) => {
  const isValid = validateOfferSelection(offerField);
  TaskButtonsManager.blockButtons(successButtons, !isValid);
  return isValid;
};

const addClickValidation = (buttonManager, offerField) => {
  const resultsBlock = buttonManager.getResultsBlock();
  if (!resultsBlock) {
    return;
  }

  resultsBlock.addEventListener('click', (event) => {
    const button = event.target.closest(buttonManager.getSuccessButtonSelector());
    if (!button) {
      return;
    }

    const isValid = validateOfferSelection(offerField);

    if (!isValid) {
      event.preventDefault();
      event.stopPropagation();
      alert(MESSAGES.OFFER_REQUIRED);
    }
  });
};

const observeFieldChanges = (offerField, successButtons) => {
  const observer = new MutationObserver(() => {
    validateAndUpdateButtons(offerField, successButtons);
  });

  observer.observe(offerField, {
    attributes: true,
    attributeFilter: ['value'],
  });
};

const lockFunnelSelectors = (form) => {
  const funnelDropdown = form.querySelector('.funnel-dropdown');
  const stageDropdown = form.querySelector('.stage-dropdown');
  const dealFunnels = form.querySelector('.deal-funnels');

  if (funnelDropdown) {
    funnelDropdown.disabled = true;
  }

  if (stageDropdown) {
    stageDropdown.disabled = true;
  }

  if (dealFunnels) {
    dealFunnels.style.marginTop = '20px';
  }
};

const validateTaskOrderCreate = (offerField, form) => {
  const buttonManager = new TaskButtonsManager(form);
  const successButtons = buttonManager.getResultButtons();

  if (!successButtons.length) {
    return;
  }

  lockFunnelSelectors(form);
  validateAndUpdateButtons(offerField, successButtons);
  addClickValidation(buttonManager, offerField);
  observeFieldChanges(offerField, successButtons);
};

const initTaskOrderValidation = () => {
  registerEnhancement(CONFIG, CONFIG.SELECTORS.CREATE_DEAL, validateTaskOrderCreate);
};

export default initTaskOrderValidation;
