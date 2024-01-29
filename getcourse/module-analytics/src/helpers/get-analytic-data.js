import { isFramed, urlModeOptions } from '../config/constants';
import {
	currentUrl,
	normalizeUrl,
	hasSearchParam,
	getSearchParamValue,
	getFilteredSearchParams,
} from '../../../../utils/url-utils';

const referrerUrl = document.referrer || 'none';

const urlPageFromFrame = hasSearchParam(currentUrl.href, 'loc')
	? new URL(getSearchParamValue(currentUrl.href, 'loc')).href
	: currentUrl.href;

const dealCreatedType = 'user';

const getCleanUrl = (inputUrl) => {
	const url = normalizeUrl(inputUrl);
	const filteredSearchParams = getFilteredSearchParams(url.href, ['id']);

	return filteredSearchParams.toString()
		? `${url.origin}${url.pathname}?${filteredSearchParams}`
		: `${url.origin}${url.pathname}`;
};

const widgetUrl = isFramed ? getCleanUrl(currentUrl.href) : 'none';

const getCurrentDate = () => {
	const options = { timeZone: 'Europe/Moscow', day: 'numeric', month: 'numeric', year: 'numeric' };
	const today = new Date().toLocaleString('ru-RU', options);
	const [day, month, year] = today.split('.').map(Number);

	const formattedDay = day < 10 ? `0${day}` : day;
	const formattedMonth = month < 10 ? `0${month}` : month;

	return `${formattedDay}.${formattedMonth}.${year}`;
};

const getPartOfDay = () => {
	const options = { timeZone: 'Europe/Moscow', hour: 'numeric' };
	const currentHour = Number(new Date().toLocaleString('ru-RU', options));

	if (currentHour >= 0 && currentHour < 6) {
		return 'Ночь';
	}
	if (currentHour >= 6 && currentHour < 12) {
		return 'Утро';
	}
	if (currentHour >= 12 && currentHour < 18) {
		return 'День';
	}
	if (currentHour >= 18 && currentHour <= 23) {
		return 'Вечер';
	}
	return '';
};

const getDeviceType = () => {
	const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
	const tabletMediaQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

	if (mobileMediaQuery.matches) {
		return 'Мобильное устройство';
	}
	if (tabletMediaQuery.matches) {
		return 'Планшет';
	}
	return 'ПК';
};

const getCurrentPageUrl = (urlMode) => {
	const url = new URL(isFramed ? urlPageFromFrame : currentUrl.href);
	const cleanUrl = getCleanUrl(url.href);

	return urlModeOptions[urlMode] ? url.href : cleanUrl || 'none';
};

export { referrerUrl, dealCreatedType, widgetUrl, getCurrentDate, getCurrentPageUrl, getPartOfDay, getDeviceType };
