/**
 * Plugin Name: GC Custom Pay
 * Description: Кастомная сумма оплаты
 * Author: RE-CODE STUDIO
 * Author URL: https://techeducation.ru/y/8bbf221
 */

(() => {
	const intervalId = setInterval(() => {
		if (window?.recode?.gcCustomPay) {
			clearInterval(intervalId);
			// Инициализируем функционал и прописываем настройки
			window.recode.gcCustomPay.init();
		}
	}, 100);
})();
