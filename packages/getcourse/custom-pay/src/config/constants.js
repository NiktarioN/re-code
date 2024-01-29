import { currentUrl } from '../../../../utils/url-utils';

const payPagePathname = '/sales/shop/dealPay/id/';

const customPayDefaultSearchParam = 'paymentValue';
const customPayFuncSearchParam = 'recode-custom-pay';
const hidePartialPayBlockSearchParam = 'recode-hide-partial-block';

const deleteTimerSearchParam = 3000;

const convertToBooleanOptions = {
	yes: true,
	no: false,
};

const isPayPage = currentUrl.pathname.includes(payPagePathname);

const formsSelector = 'form.lt-form';

export {
	payPagePathname,
	customPayDefaultSearchParam,
	customPayFuncSearchParam,
	hidePartialPayBlockSearchParam,
	deleteTimerSearchParam,
	convertToBooleanOptions,
	isPayPage,
	formsSelector,
};
