/**
 * Plugin Name: gcCrmImprovements
 * Description: Улучшение CRM GetCourse
 * Author: RE-CODE STUDIO
 * Author URL: https://techeducation.ru/y/8bbf221
 */

(() => {
	const intervalId = setInterval(() => {
		if (window?.recode?.gcCrmImprovements) {
			clearInterval(intervalId);
			// Инициализируем функционал и прописываем настройки
			window.recode.gcCrmImprovements.init({
				taskOrder: [
					{
						id: '1580551',
						title: 'Создать задачу на обработку платного заказа',
						proccessTitle: 'CRM | Обработка платного заказа',
					},
				],
				dealHasChangedFieldId: 10085598,
				hideTrashInTasks: true,
				bigButtonsInTasks: true,
			});
		}
	}, 100);
})();
