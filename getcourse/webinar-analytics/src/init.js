/**
 * Plugin Name: gcModuleAnalytics
 * Description: Модуль аналитики на GetCourse
 * Author: RE-CODE STUDIO
 * Author URL: https://techeducation.ru/y/8bbf221
 */

(() => {
	const intervalId = setInterval(() => {
		if (window?.recode?.gcModuleAnalytics) {
			clearInterval(intervalId);
			// Инициализируем функционал и прописываем настройки
			window.recode.gcModuleAnalytics.init({
				fields: [
					{
						id: '999999',
						title: 'user_tech_utm_source',
						type: 'user',
						valueType: 'param',
						trigger: 'utm_source',
					},
					{
						id: '888888',
						title: 'user_tech_utm_medium',
						type: 'user',
						valueType: 'param',
						trigger: 'utm_medium',
					},
					{
						id: '777777',
						title: 'user_tech_utm_campaign',
						type: 'user',
						valueType: 'param',
						trigger: 'utm_campaign',
					},
					{
						id: '666666',
						title: 'user_tech_utm_content',
						type: 'user',
						valueType: 'param',
						trigger: 'utm_content',
					},
					{
						id: '555555',
						title: 'user_tech_utm_term',
						type: 'user',
						valueType: 'param',
						trigger: 'utm_term',
					},
					{
						id: '999999',
						title: 'deal_utm_source',
						type: 'deal',
						valueType: 'param',
						trigger: 'utm_source',
					},
					{
						id: '888888',
						title: 'deal_utm_medium',
						type: 'deal',
						valueType: 'param',
						trigger: 'utm_medium',
					},
					{
						id: '777777',
						title: 'deal_utm_campaign',
						type: 'deal',
						valueType: 'param',
						trigger: 'utm_campaign',
					},
					{
						id: '666666',
						title: 'deal_utm_content',
						type: 'deal',
						valueType: 'param',
						trigger: 'utm_content',
					},
					{
						id: '555555',
						title: 'deal_utm_term',
						type: 'deal',
						valueType: 'param',
						trigger: 'utm_term',
					},
					{
						id: '444444',
						title: 'deal_cookie',
						type: 'deal',
						valueType: 'cookie',
						trigger: 'PHPSESSID',
					},
					{
						id: '333333',
						title: 'deal_referrer',
						type: 'deal',
						valueType: 'other',
						trigger: 'referrer',
					},
					{
						id: '222222',
						title: 'deal_created_url_full',
						type: 'deal',
						valueType: 'other',
						trigger: 'url_full',
					},
					{
						id: '111111',
						title: 'deal_created_url_clean',
						type: 'deal',
						valueType: 'other',
						trigger: 'url_clean',
					},
					{
						id: '000000',
						title: 'deal_created_date',
						type: 'deal',
						valueType: 'other',
						trigger: 'created_date',
					},
					{
						id: '999999',
						title: 'deal_created_type',
						type: 'deal',
						valueType: 'other',
						trigger: 'created_type',
					},
				],
			});
		}
	}, 100);
})();
