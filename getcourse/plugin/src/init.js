/**
 * Plugin Name: recodePlugin
 * Description: Плагин для GetCourse
 * Author: RE-CODE STUDIO
 * Author URL: https://techeducation.ru/y/8bbf221
 */

(() => {
	const intervalId = setInterval(() => {
		if (window?.recode?.gcPlugin) {
			clearInterval(intervalId);
			// Инициализируем функционал и прописываем настройки
			window.recode.gcPlugin.init();
		}
	}, 100);
})();
