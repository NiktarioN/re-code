import { isDealPage } from '../../../../utils/page-checker';
import { getDealStatus } from '../../../../utils/gets';

const CONFIG = {
  DEAL_STATUSES: ['Завершен'],
  SELECTORS: {
    EXPECTED_PAYMENTS: '.payments-table tr:has(td:nth-child(3) option[selected][value="expected"])',
  },
};

const app = () => {
  if (!isDealPage) {
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

export default app;