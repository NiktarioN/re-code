/* eslint-disable no-alert */

// Поставил нужный статус и не указал причину отказа
// Поставил нужный статус, начал указывать комментарий и не указал причину отказа
// Поставил ненужный статус, указал там что-то и поставил нужный статус
// Взял и выбрал тот же статус

import { isDealPage } from '../../../../../utils/page-checker';
import { getDealCost } from '../../../../../utils/gets';
import { getValueFromSelect } from '../../../../../../utils/gets';

const targetStatuses = ['Отменен', 'Ложный'];

const isTargetStatus = (currentStatus) => targetStatuses.some((status) => status === currentStatus);

const isCancelReasonSelected = (selectNode) => getValueFromSelect(selectNode) !== '-- не выбрана --';

const validateCancelReason = (selectedStatus, reasonSelect, commentInput) => {
  const reasonSelected = isCancelReasonSelected(reasonSelect);
  const reasonComment = commentInput.value.trim();

  if (reasonComment && !reasonSelected) {
    alert('Перед тем как писать комментарий выбери причину отказа у заказа');
    reasonSelect.closest('.deal-state-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!reasonSelected) {
    alert(`Нельзя перевести заказ в статус "${selectedStatus}", не указав причину отмены`);
    reasonSelect.closest('.deal-state-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const saveHandler = (event, dealChangeStatus, dealCancelReasonId, dealCancelReasonComment) => {
  const selectedDealStatus = getValueFromSelect(dealChangeStatus);
  if (
    isTargetStatus(selectedDealStatus) &&
    !validateCancelReason(selectedDealStatus, dealCancelReasonId, dealCancelReasonComment)
  ) {
    event.preventDefault();
  }
};

const setOrderCancelReason = () => {
  if (!isDealPage) {
    return;
  }

  const dealStatePanel = document.querySelector('.deal-state-panel');
  const dealChangeStatus = dealStatePanel?.querySelector('[name="Deal[change_status]"]');
  const dealCancelReasonId = dealStatePanel?.querySelector('[name="Deal[cancel_reason_id]"]');
  const dealCancelReasonComment = dealStatePanel?.querySelector('[name="Deal[cancel_reason_comment]"]');
  const dealManager = dealStatePanel?.querySelector('.manager-link')?.trim();
  const dealCost = getDealCost();
  const saveButtons = document.querySelectorAll('.page-actions button.btn-primary, [name="save"]');

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

  if (dealManager !== '<Не выбран>' && dealCost === 0) {
    // eslint-disable-next-line no-console
    console.log('Менеджер не выбран в заказе и заказ нулевой. Причину отмены можно не указывать');
    return;
  }

  dealChangeStatus.addEventListener('change', () => {
    saveButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        saveHandler(event, dealChangeStatus, dealCancelReasonId, dealCancelReasonComment);
      });
    });

    // eslint-disable-next-line no-undef
    $('.page-main-form').off('submit').on('submit', (event) => {
      saveHandler(event, dealChangeStatus, dealCancelReasonId, dealCancelReasonComment);
    });
  });
};

export default setOrderCancelReason;