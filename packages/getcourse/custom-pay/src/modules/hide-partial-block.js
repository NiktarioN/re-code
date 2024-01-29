import { currentUrl, hasSearchParam } from '../../../../utils/url-utils';

const hidePartialblock = (searchParam) => {
	const needHide = hasSearchParam(document.referrer, searchParam) || hasSearchParam(currentUrl, searchParam);
	if (!needHide) {
		return;
	}

	document.querySelectorAll('.xdget-partialpay .btn').forEach((button) => button.classList.add('hide'));
};

export default hidePartialblock;
