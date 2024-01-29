/**
 * Plugin Name: gcSurveyParser
 * Description: Парсер анкеты на GetCourse
 * Author: RE-CODE STUDIO
 * Author URL: https://techeducation.ru/y/8bbf221
 */

(() => {
	const intervalId = setInterval(() => {
		if (window?.recode?.gcSurveyParser) {
			clearInterval(intervalId);
			// Инициализируем функционал и прописываем настройки
			window.recode.gcSurveyParser.init({
				userFieldId: '',
				dealFieldId: '',
			});
		}
	}, 100);
})();
