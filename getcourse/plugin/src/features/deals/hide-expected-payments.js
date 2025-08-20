import { isDealPage } from '../../../../utils/page-checker';
import { getDealStatus } from '../../../../utils/gets';

import { GLOBAL_CONFIG } from '../../config/config';

const CONFIG = {
  DEAL_STATUSES: ['Завершен'],
  SELECTORS: {
    EXPECTED_PAYMENTS: '.payments-table tr:has(td:nth-child(3) option[selected][value="expected"])',
  },
};

export const hideExpectedPayments = () => {
  if (!isDealPage) {
    return;
  }

  const config = GLOBAL_CONFIG.hideExpectedPayments;

  if (typeof config !== 'boolean') {
    console.error('hideExpectedPayments config is not a boolean');
    return;
  }

  if (!config) {
    return;
  }

  const currentStatus = getDealStatus();

  const isTargetStatus = CONFIG.DEAL_STATUSES.includes(currentStatus);
  if (!isTargetStatus) {
    return;
  }

  const expectedPaymentRows = document.querySelectorAll(CONFIG.SELECTORS.EXPECTED_PAYMENTS);
  expectedPaymentRows.forEach((row) => row.classList.add('hide'));
};