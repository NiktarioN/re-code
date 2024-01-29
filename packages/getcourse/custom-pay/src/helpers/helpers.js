import { removeSearchParams } from '../../../../utils/url-utils';

const removeSearchParamCustomPay = (inputUrl, searchParam) => {
	window.history.pushState({}, '', removeSearchParams(inputUrl, searchParam).href);
};

export default removeSearchParamCustomPay;
