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
				// Скрывать ли метод отправки сообщений по смс
				hideSmsSenderType: true,
				// ID доп. поля для фиксации изменения заказа
				dealHasChangedFieldId: '',
				// Улучшать ли кнопки в задачах
				improveTaskButtons: true,
				// Скрывать ли кнопку "Отложить" в задачах
				hideTaskDelayBtn: false,
				// Перезагружать ли страницу заказа
				reloadOrderPage: true,
				// Добавление кнопки для быстрого создания задачи
				taskOrder: [],
				// Скрывать ли технические задачи у сотрудников в карточках объектов
				hideTasksInOrder: {
					usersList: {
						idList: [],
					},
					searchWords: ['[TECH]'],
				},
				// Кто может менять менеджера заказа и личного менеджера
				changeManager: {
					idList: [],
				},
				// Кто имеет доступ к процессам и может их редактировать
				canEditProcesses: {
					idList: [],
				},
			});
		}
	}, 100);
})();
