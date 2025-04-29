import { getDealStatus, getDealCost } from '../../../../utils/gets';
import { isDealPage } from '../../../../utils/page-checker';

const CONFIG = {
  SELECTORS: {
    ADD_POSITION_BLOCK: '#addPositionBlock',
    DEAL_POSITIONS: '.deal-position-tr',
    DEAL_POSITION_DELETE: '.delete-position-link',
    DEAL_POSITION_PRICE: '.price',
    DEAL_POSITIONS_CONTAINER: '.positions-table',
    ADD_PAYMENTS_BUTTON: '.add-payment-link',
  },
};

const createHintNode = () => {
  const node = document.createElement('div');
  node.classList.add('recode-hint', 'recode-hint--warning', 'recode-hint--free-offer');

  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-info-circle');
  node.setAttribute('role', 'alert');
  node.appendChild(icon);

  const span = document.createElement('span');
  span.innerHTML = 'В бесплатных заказах <strong>запрещено</strong> изменять позиции';
  node.appendChild(span);

  return node;
};

const app = () => {
  if (!isDealPage) {
    return;
  }

  const dealCost = getDealCost();
  const dealStatus = getDealStatus();

  if (dealCost > 0) {
    return;
  }

  const dealPositionsContainer = document.querySelector(CONFIG.SELECTORS.DEAL_POSITIONS_CONTAINER);

  if (dealStatus === 'Завершен') {
    dealPositionsContainer.parentElement.querySelector('.alert-warning')?.classList.add('hide');
    return;
  }

  const addPositionBlock = document.querySelector(CONFIG.SELECTORS.ADD_POSITION_BLOCK);
  if (!addPositionBlock) {
    return;
  }

  const hint = createHintNode();
  dealPositionsContainer.parentElement.prepend(hint);

  const parentAddPositionBlock = addPositionBlock.closest('.new-position');
  parentAddPositionBlock?.classList.add('hide');

  const dealPositions = dealPositionsContainer.querySelectorAll(CONFIG.SELECTORS.DEAL_POSITIONS);
  dealPositions.forEach((position) => {
    const deleteButton = position.querySelector(CONFIG.SELECTORS.DEAL_POSITION_DELETE);
    const price = position.querySelector(CONFIG.SELECTORS.DEAL_POSITION_PRICE);

    deleteButton?.classList.add('hide');
    price?.classList.add('hide');
  });

  const addPaymentButton = document.querySelector(CONFIG.SELECTORS.ADD_PAYMENTS_BUTTON);
  addPaymentButton?.classList.add('hide');
};

export default app;
