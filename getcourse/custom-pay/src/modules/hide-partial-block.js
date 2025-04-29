import { hasSearchParam } from '../../../../utils/url-utils';

const hidePartialblock = (searchParam) => {
  const needHide = hasSearchParam(document.referrer, searchParam) || hasSearchParam(window.location.href, searchParam);
  if (!needHide) {
    return;
  }

  document.querySelectorAll('.xdget-partialpay .btn, .gcpay-widget-btn--partial-payment').forEach((button) => button.classList.add('hide'));
};

export default hidePartialblock;
