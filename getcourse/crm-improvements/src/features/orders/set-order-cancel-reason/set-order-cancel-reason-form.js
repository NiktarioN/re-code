/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */

import { getValueFromSelect } from '../../../../../../utils/gets';
import { isTargetStatus, isCancelReasonSelected } from '../../../../../utils/helpers';

const SELECTORS = {
  status: '[name="ChangeStatusOperation[status]"]',
  cancelReason: '[name="ChangeStatusOperation[cancel_reason_id]"]',
  cancelComment: '[name="ChangeStatusOperation[cancel_reason_comment]"]',
  submitButtons: '.results-block > [type="submit"]',
};
const TARGET_STATUSES = ['Отменен', 'Ложный'];

const blockButtons = (buttons, shouldBlock) => {
  buttons.forEach((btn) => btn.classList.toggle('recode-disabled', shouldBlock));
};

const validateAndBlockButtons = (changeStatus, cancelReason, submitButtons) => {
  const selectedStatus = getValueFromSelect(changeStatus);
  const shouldBlock = isTargetStatus(selectedStatus, TARGET_STATUSES) && !isCancelReasonSelected(cancelReason);

  blockButtons(submitButtons, shouldBlock);

  return shouldBlock;
};

const initFormLogic = (form) => {
  const dealChangeStatus = form.querySelector(SELECTORS.status);
  const dealCancelReasonId = form.querySelector(SELECTORS.cancelReason);
  const dealCancelReasonComment = form.querySelector(SELECTORS.cancelComment);
  const submitButtons = [...form.querySelectorAll(SELECTORS.submitButtons)].filter(
    (button) => !button.textContent.toLowerCase().trim().includes('назад')
  );

  if (!submitButtons.length) {
    return;
  }

  const handleValidation = () => validateAndBlockButtons(dealChangeStatus, dealCancelReasonId, submitButtons);

  const handleCommentFocus = () => {
    if (validateAndBlockButtons(dealChangeStatus, dealCancelReasonId, submitButtons)) {
      alert('Перед написанием комментария выбери причину отказа');
      dealCancelReasonId.focus();
    }
  };

  const handleSubmitValidation = (event) => {
    if (validateAndBlockButtons(dealChangeStatus, dealCancelReasonId, submitButtons)) {
      event.preventDefault();
      alert('Нельзя пойти дальше, не указав причину отказа');
      dealCancelReasonId.focus();
    }
  };

  validateAndBlockButtons(dealChangeStatus, dealCancelReasonId, submitButtons);

  dealChangeStatus.addEventListener('change', handleValidation);
  dealCancelReasonId.addEventListener('change', handleValidation);
  dealCancelReasonComment.addEventListener('focus', handleCommentFocus);
  submitButtons.forEach((button) => button.addEventListener('click', handleSubmitValidation));
};

const monitorForm = (form) => {
  const observer = new MutationObserver(() => {
    const dealChangeStatus = form.querySelector(SELECTORS.status);
    if (dealChangeStatus) {
      if (!form.classList.contains('recode-monitor-form-initialized')) {
        initFormLogic(form);
        form.classList.add('recode-monitor-form-initialized');
      }
    } else {
      form.classList.remove('recode-monitor-form-initialized');
    }
  });

  observer.observe(form, { childList: true, subtree: true });
};

const app = () => {
  const forms = document.querySelectorAll('.task-form');
  forms.forEach((form) => {
    monitorForm(form);
  });
};

export default app;
