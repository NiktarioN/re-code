/**
 * Plugin Name: setSearchParamsInFields
 * Description: Установка значений параметров из URL в поля формы
 * Author: RE-CODE STUDIO
 * Author URL: tg: https://techeducation.ru/y/8bbf221
 */

(() => {
	const intervalId = setInterval(() => {
		if (window?.recode?.setSearchParamsInFields) {
			clearInterval(intervalId);
			// Инициализируем функционал и прописываем настройки
			window.recode.setSearchParamsInFields.init({
				searchParamsFields: [
					['ID_ПОЛЯ', 'user', 'utm_source'],
					['ID_ПОЛЯ', 'user', 'utm_medium'],
					['ID_ПОЛЯ', 'user', 'utm_campaign'],
					['ID_ПОЛЯ', 'user', 'utm_content'],
					['ID_ПОЛЯ', 'user', 'utm_term'],
					['ID_ПОЛЯ', 'deal', 'utm_source'],
					['ID_ПОЛЯ', 'deal', 'utm_medium'],
					['ID_ПОЛЯ', 'deal', 'utm_campaign'],
					['ID_ПОЛЯ', 'deal', 'utm_content'],
					['ID_ПОЛЯ', 'deal', 'utm_term'],
					['ID_ПОЛЯ', 'deal', 'contractor'],
					['ID_ПОЛЯ', 'deal', 'gcpc'],
					['ID_ПОЛЯ', 'deal', 'gcmlg'],
				],
				dealCreatedUrl: 'ID_ПОЛЯ',
			});
		}
	}, 100);
})();
