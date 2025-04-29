import { hasSearchParam } from "../../../../utils/url-utils";

const setupRedirects = (config, obj, customPayFuncSearchParam, hidePartialPayBlockSearchParam, partialPayFuncSearchParam, isOldPayPage, isNewPayPage) => {
  if (isOldPayPage) {
    if (hasSearchParam(document.referrer, customPayFuncSearchParam)) {
      obj.redirectToCustomPay(customPayFuncSearchParam, config.needHidePartialPayBlock, hidePartialPayBlockSearchParam);
    }
    if (hasSearchParam(document.referrer, partialPayFuncSearchParam)) {
      obj.setPartialPay(partialPayFuncSearchParam);
    }
    obj.hidePartialblock(hidePartialPayBlockSearchParam);
  } else if (isNewPayPage) {
    obj.setPartialPay(partialPayFuncSearchParam);
    obj.hidePartialblock(hidePartialPayBlockSearchParam);
  }
};

export default setupRedirects;