import { partialPayFuncSearchParam, deleteTimerSearchParam } from '../config/constants';
import { addSearchParams, removeSearchParamFromHistory } from '../../../../utils/url-utils';

const partialPay = () => {
  window.history.pushState({}, '', addSearchParams(window.location.href, [[partialPayFuncSearchParam, '']]).href);

  setTimeout(() => {
    removeSearchParamFromHistory(window.location.href, partialPayFuncSearchParam);
  }, deleteTimerSearchParam);
};

export default partialPay;