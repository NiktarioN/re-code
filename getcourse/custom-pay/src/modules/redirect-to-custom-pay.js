import { customPayDefaultSearchParam } from '../config/constants';
import { currentUrl, getSearchParamValue } from '../../../../utils/url-utils';

const redirectToCustomPay = (customPaySearchParam, needHidePartialPayBlock, hidePartialPayBlockSearchParam) => {
	if (!document.referrer) {
		return;
	}

	const customPayValue = getSearchParamValue(document.referrer, customPaySearchParam);
	if (!customPayValue) {
		return;
	}

	const redirectUrl = currentUrl;
	redirectUrl.searchParams.set(customPayDefaultSearchParam, customPayValue);

	if (needHidePartialPayBlock) {
		redirectUrl.searchParams.set(hidePartialPayBlockSearchParam, '');
		window.history.pushState({}, '', redirectUrl.href);
	}

	window.location.href = redirectUrl.href;
};

export default redirectToCustomPay;
