import { customPayFuncSearchParam, deleteTimerSearchParam } from '../config/constants';
import { currentUrl, addSearchParams } from '../../../../utils/url-utils';
import removeSearchParamCustomPay from '../helpers/helpers';
import getCustomPayValue from '../helpers/get-custom-pay-value';

const manyOffers = (nodeSelector) => {
	const customPayBlock = document.querySelector(nodeSelector);
	const form = customPayBlock?.closest('form');
	const selectedNode = form?.querySelector('.custom-pay label.selected');
	if (!selectedNode) {
		return;
	}

	const value = getCustomPayValue(selectedNode);
	window.history.pushState({}, '', addSearchParams(currentUrl, [[customPayFuncSearchParam, value]]).href);

	setTimeout(() => {
		removeSearchParamCustomPay(currentUrl, customPayFuncSearchParam);
	}, deleteTimerSearchParam);
};

export default manyOffers;
