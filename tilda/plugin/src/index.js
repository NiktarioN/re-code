/**
 * Plugin Name: Tilda Plugin
 * Description: Плагин для Tilda
 * Version: 1.0
 */

import { currentUrl, getAllSearchParams } from '../../../utils/url-utils';
import setSearchParamsInElements from './features/analytic/set-search-params';
import fillFormFieldsFromUrl from './features/forms/fill-form-fields-from-url';
import transferFormFields from './features/forms/transfer-form-fields';

window.recode = {
	...(window.recode || {}),
	tildaPlugin: {
		init() {
			const windowSearchParams = getAllSearchParams(currentUrl.href);
			const allWindowSearchParams = [...windowSearchParams];

			if (allWindowSearchParams.length) {
				setSearchParamsInElements(allWindowSearchParams);
				fillFormFieldsFromUrl();
				transferFormFields();
			}
		},
	},
};

window.recode.tildaPlugin.init();
