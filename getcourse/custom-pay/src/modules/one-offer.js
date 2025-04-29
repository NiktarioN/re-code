import { customPayFuncSearchParam, deleteTimerSearchParam } from '../config/constants';
import { addSearchParams, removeSearchParamFromHistory } from '../../../../utils/url-utils';

const oneOffer = (paymentCost) => {
  if (!paymentCost) {
    return;
  }

  window.history.pushState({}, '', addSearchParams(window.location.href, [[customPayFuncSearchParam, paymentCost]]).href);

  setTimeout(() => {
    removeSearchParamFromHistory(window.location.href, customPayFuncSearchParam);
  }, deleteTimerSearchParam);
};

export default oneOffer;
