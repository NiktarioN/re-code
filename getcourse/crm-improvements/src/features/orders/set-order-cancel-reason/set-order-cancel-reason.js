/* eslint-disable no-alert */

import { isDealPage } from '../../../../../utils/page-checker';
import { getDealStatus, getDealCost } from '../../../../../utils/gets';
import { getValueFromSelect } from '../../../../../../utils/gets';
import { isTargetStatus, isDealStatusSelected, isCancelReasonSelected } from '../../../../../utils/helpers';

const SELECTORS = {
  statePanel: '.deal-state-panel',
  status: '[name="Deal[change_status]"]',
  cancelReason: '[name="Deal[cancel_reason_id]"]',
  cancelComment: '[name="Deal[cancel_reason_comment]"]',
  saveButtons: '.page-actions button.btn-primary, [name="save"]',
  managerLink: '.manager-link',
};
const TARGET_STATUSES = ['Отменен', 'Ложный'];

const createAlertBlock = () => {
  const alertBlock = document.createElement('div');
  alertBlock.classList.add('recode-cancel-reason-hint', 'hide');
  alertBlock.innerHTML = `
    <span class="recode-cancel-reason-hint__text">
      <i class="fa-solid fa-circle-exclamation"></i> Выбери причину отказа в блоке ниже
    </span>
  `;

  return alertBlock;
};

const showCancelReasonAlert = (alertBlock, parentNode) => {
  alertBlock.classList.remove('hide');
  alert('Нельзя отменять или удалять заказ, не указав причину отказа');

  parentNode.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

const shouldShowAlert = (currentStatus, selectedStatus, cancelReasonNode, orderChangeStatusNode) => {
  const isTargetStatusSelected = isTargetStatus(selectedStatus, TARGET_STATUSES);
  const isCancelReasonNotSelected = !isCancelReasonSelected(cancelReasonNode);

  return (
    (isTargetStatus(currentStatus, TARGET_STATUSES) && isTargetStatusSelected && isCancelReasonNotSelected) ||
    (isTargetStatus(currentStatus, TARGET_STATUSES) &&
      !isDealStatusSelected(orderChangeStatusNode) &&
      isCancelReasonNotSelected) ||
    (!isTargetStatus(currentStatus, TARGET_STATUSES) && isTargetStatusSelected && isCancelReasonNotSelected)
  );
};

const validateCancelReason = (parentNode, dealChangeStatus, cancelReasonNode, saveButtons) => {
  const alertBlock = createAlertBlock();
  cancelReasonNode.parentNode.firstChild.before(alertBlock);

  saveButtons.forEach((button) =>
    button.addEventListener('mouseenter', () => {
      const currentStatus = getDealStatus();
      const selectedStatus = getValueFromSelect(dealChangeStatus);

      if (!shouldShowAlert(currentStatus, selectedStatus, cancelReasonNode, dealChangeStatus)) {
        return;
      }
      showCancelReasonAlert(alertBlock, parentNode);
    })
  );
};

const setOrderCancelReason = () => {
  if (!isDealPage) {
    return;
  }

  const dealStatePanel = document.querySelector(SELECTORS.statePanel);
  const dealChangeStatus = dealStatePanel?.querySelector(SELECTORS.status);
  const dealCancelReasonId = dealStatePanel?.querySelector(SELECTORS.cancelReason);
  const dealCancelReasonComment = dealStatePanel?.querySelector(SELECTORS.cancelComment);
  const dealManager = dealStatePanel?.querySelector(SELECTORS.managerLink)?.textContent?.trim();
  const dealCost = getDealCost();
  const saveButtons = document.querySelectorAll(SELECTORS.saveButtons);

  if (
    !dealStatePanel ||
    !dealChangeStatus ||
    !dealCancelReasonId ||
    dealCancelReasonId.options.length <= 1 ||
    !dealCancelReasonComment ||
    !dealManager
  ) {
    return;
  }

  if (dealManager === '<Не выбран>' && dealCost === 0) {
    return;
  }

  validateCancelReason(dealStatePanel, dealChangeStatus, dealCancelReasonId, saveButtons);
};

export default setOrderCancelReason;