import { redirectToUrl } from '../helpers/helpers';
import { currentUrl, getAllSearchParams, addSearchParams } from '../../../../utils/url-utils';
import parseLocalStorage from '../../../../utils/local-storage';

const transferParams = (inputUrl, redirectMode) => {
	if (!inputUrl) {
		throw new Error('RE-CODE STUDIO. Плагин gcModuleAnalytics. Некорректный адрес URL в transferParams');
	}

	const allSearchParams = [...getAllSearchParams(currentUrl.href)];
	const redirectUrl = addSearchParams(inputUrl, allSearchParams).href;

	redirectToUrl(redirectUrl, redirectMode);
};

const transferSearchAndFormParams = (inputUrl, redirectMode) => {
	if (!inputUrl) {
		throw new Error('RE-CODE STUDIO. Плагин gcModuleAnalytics. Некорректный адрес URL в transferSearchAndFormParams');
	}

	const localStorageUserData = parseLocalStorage.getValue('recode-user-data');
	const userData = localStorageUserData ? new URLSearchParams(localStorageUserData) : localStorageUserData;

	const allSearchParams = [...getAllSearchParams(currentUrl.href)];
	const combinedSearchParams = [...allSearchParams, ...userData].filter((value) => value);
	const redirectUrl = addSearchParams(inputUrl, combinedSearchParams).href;

	redirectToUrl(redirectUrl, redirectMode);
};

export { transferParams, transferSearchAndFormParams };
