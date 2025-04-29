import { currentUrl } from '../../../../utils/url-utils';

const customPayDefaultSearchParam = 'paymentValue';
const customPayFuncSearchParam = 'recode-custom-pay';
const partialPayFuncSearchParam = 'recode-partial-pay';
const hidePartialPayBlockSearchParam = 'recode-hide-partial-block';

const deleteTimerSearchParam = 10000;

const convertToBooleanOptions = {
  yes: true,
  no: false,
};

const isPayPage = currentUrl.pathname.includes('/sales/shop/dealPay/id/');
const isApp = !!document.querySelector('#app');
const isOldPayPage = isPayPage && !isApp;
const isNewPayPage = isPayPage && isApp;

const formsSelector = 'form.lt-form';

export {
  customPayDefaultSearchParam,
  customPayFuncSearchParam,
  partialPayFuncSearchParam,
  hidePartialPayBlockSearchParam,
  deleteTimerSearchParam,
  convertToBooleanOptions,
  isPayPage,
  isOldPayPage,
  isNewPayPage,
  formsSelector,
};
