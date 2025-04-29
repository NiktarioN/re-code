import { customPayFuncSearchParam, deleteTimerSearchParam } from '../config/constants';
import { addSearchParams, removeSearchParamFromHistory } from '../../../../utils/url-utils';
import getCustomPayValue from './get-custom-pay-value';

const manyOffers = (nodeSelector) => {
  const customPayBlock = document.querySelector(nodeSelector);
  const form = customPayBlock?.closest('form');
  const selectedNode = form?.querySelector('.custom-pay label.selected, .recode-custom-pay label.selected');
  if (!selectedNode) {
    return;
  }

  const value = getCustomPayValue(selectedNode);
  window.history.pushState({}, '', addSearchParams(window.location.href, [[customPayFuncSearchParam, value]]).href);

  setTimeout(() => {
    removeSearchParamFromHistory(window.location.href, customPayFuncSearchParam);
  }, deleteTimerSearchParam);
};

export default manyOffers;
