import { isFramed, dontResetSearchParams } from '../config/constants';
import { normalizeUrl, hasSearchParamValue } from '../../../utils/url-utils';

const redirectModesOptions = {
	'location.href': 'current-window',
	'window.open': 'new-window',
};

const redirectModes = {
	'new-window': (url) => window.open(url, '_blank'),
	'current-window': (url) => {
		if (isFramed) {
			window.top.location.href = url;
		} else {
			window.location.href = url;
		}
	},
};

const redirectToUrl = (inputUrl, redirectMode) => {
	const url = normalizeUrl(inputUrl);
	const redirectAction = redirectModes[redirectMode];
	redirectAction(url);
};

const createNode = (nodeType, nodeClass) => {
	const node = document.createElement(nodeType);
	if (nodeClass) {
		node.classList.add(nodeClass);
	}

	return node;
};

const hasDontResetSearchParamValue = (inputUrl, searchParam) => {
	const isDontResetSearchParams = dontResetSearchParams.some(
		(dontResetSearchParam) => searchParam === dontResetSearchParam
	);
	if (!isDontResetSearchParams) {
		return true;
	}
	return hasSearchParamValue(inputUrl, searchParam);
};

export { redirectModesOptions, redirectToUrl, createNode, hasDontResetSearchParamValue };
