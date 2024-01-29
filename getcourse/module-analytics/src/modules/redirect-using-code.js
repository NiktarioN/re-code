import { redirectToUrl } from '../helpers/helpers';
import { currentUrl, getAllSearchParams, addSearchParams } from '../../../../utils/url-utils';

export default (inputUrl, redirectMode) => {
	if (!inputUrl) {
		throw new Error('RE-CODE STUDIO. Плагин gcModuleAnalytics. Не указан адрес для редиректа');
	}

	redirectToUrl(addSearchParams(inputUrl, [...getAllSearchParams(currentUrl.href)]).href, redirectMode);
};
