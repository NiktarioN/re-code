/**
 * Plugin Name: gcCrmImprovements
 * Description: Улучшение CRM GetCourse
 * Version: 1.0
 */

// Добавить в панель с заказами кнопку "Свернуть/Развернуть все"

import setConfig from './config/config';
import addStyles from './features/styles';
import createOrderTask from './features/create-order-task';
import hideTrashInTasks from './features/hide-trash-in-tasks';
import setBigButtonsInTasks from './features/set-big-buttons-in-tasks';
import moveTasksToTheTop from './features/move-tasks-top';
import hideTasksInOrder from './features/hide-tasks-in-order';
import setDealHasChanged from './features/set-deal-has-changed';
import showCurrentOrder from './features/show-current-order';
import hideSmsSenderType from './features/hide-sms-sender-type';
import validateTgLogin from './features/validate-tg-login';
import improveTasksForms from './features/improve-tasks';
import hideManagerOperationList from './features/hide-manager-operation-list';
import changeManagerInOrder from './features/change-manager-in-order';
import setOrderCancelReason from './features/set-order-cancel-reason';

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
				hideTasksInOrder: hideTasksInOrderConfig,
				hideManagerOperationList: hideManagerOperationListConfig,
				changeManagerInOrder: changeManagerInOrderConfig,
			} = this.config || {};

			addStyles();
			taskOrder.forEach((config) => createOrderTask(config));
			hideTasksInOrder(hideTasksInOrderConfig);
			improveTasksForms();
			moveTasksToTheTop();
			hideManagerOperationList(hideManagerOperationListConfig);
			changeManagerInOrder(changeManagerInOrderConfig);
			setOrderCancelReason();
			validateTgLogin();

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
		},
	},
};
