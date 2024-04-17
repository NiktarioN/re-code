/**
 * Plugin Name: gcCrmImprovements
 * Description: Улучшение CRM GetCourse
 * Version: 1.0
 */

// Добавить в панель с заказами кнопку "Свернуть/Развернуть все"

import setConfig from './config/config';
import setDealHasChanged from './features/set-deal-has-changed';
import hideTrashInTasks from './features/hide-trash-in-tasks';
import setBigButtonsInTasks from './features/set-big-buttons-in-tasks';
import showCurrentOrder from './features/show-current-order';
import createDealTask from './features/create-deal-task';
import hideSmsSenderType from './features/hide-sms-sender-type';
import validateTgLogin from './features/validate-tg-login';

window.recode = {
	...(window.recode || {}),
	gcCrmImprovements: {
		init(options = {}) {
			if (this.config) {
				throw new Error('RE-CODE STUDIO. Плагин gcCrmImprovements. Повторная инициализация функционала невозможна');
			}

			this.config = setConfig(options);
			const {
				taskOrder,
				dealHasChangedFieldId,
				hideTrashInTasks: hideTrashInTasksValue,
				bigButtonsInTasks: bigButtonsInTasksValue,
				hideSmsSenderType: hideSmsSenderTypeValue,
				showCurrentOrder: showCurrentOrderValue,
			} = this.config || {};

			taskOrder?.forEach((config) => createDealTask(config));

			if (dealHasChangedFieldId) {
				setDealHasChanged(dealHasChangedFieldId);
			}

			if (hideTrashInTasksValue === true) {
				hideTrashInTasks();
			}

			if (bigButtonsInTasksValue === true) {
				setBigButtonsInTasks();
			}

			if (hideSmsSenderTypeValue === true) {
				hideSmsSenderType();
			}

			if (showCurrentOrderValue === true) {
				showCurrentOrder();
			}

			validateTgLogin();
		},
	},
};
