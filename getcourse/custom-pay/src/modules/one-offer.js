import { customPayFuncSearchParam, deleteTimerSearchParam } from '../config/constants';
import { currentUrl, addSearchParams } from '../../../../utils/url-utils';
import removeSearchParamCustomPay from '../helpers/helpers';

const oneOffer = (value) => {
	if (!value) {
		return;
	}

	window.history.pushState({}, '', addSearchParams(currentUrl, [[customPayFuncSearchParam, value]]).href);

	setTimeout(() => {
		removeSearchParamCustomPay(currentUrl);
	}, deleteTimerSearchParam);
};

export default oneOffer;
