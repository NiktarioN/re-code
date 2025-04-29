import { partialPayFuncSearchParam } from '../config/constants';
import { hasSearchParam } from '../../../../utils/url-utils';

const tryClickPartialPayButton = () => {
  const partialPayButton = document.querySelector('.gcpay-widget-btn--partial-payment, .xdget-partialpay .btn');
  if (partialPayButton) {
    partialPayButton.click();
    return true;
  }
  return false;
};

const observeWidgetOrder = (timeout = 15000) => {
  let timeoutId;

  const observer = new MutationObserver(() => {
    if (tryClickPartialPayButton()) {
      observer.disconnect();
      clearTimeout(timeoutId);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  timeoutId = setTimeout(() => {
    observer.disconnect();
  }, timeout);
};

const setPartialPay = () => {
  if (!document.referrer || !hasSearchParam(document.referrer, partialPayFuncSearchParam)) {
    return;
  }

  if (!tryClickPartialPayButton()) {
    observeWidgetOrder();
  }
};

export default setPartialPay;