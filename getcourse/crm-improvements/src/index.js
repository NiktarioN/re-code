/**
 * Plugin Name: gcCrmImprovements
 * Description: Улучшение CRM GetCourse
 * Version: 3.1
 */

// Добавить в панель с заказами кнопку "Свернуть/Развернуть все"

import setConfig from './config/config';
import createOrderTask from './features/tasks/create-order-task';
import hideTrashInTasks from './features/tasks/hide-trash';
import hideTaskDelayBtn from './features/tasks/hide-delay-btn';
import setBigButtonsInTasks from './features/tasks/improve-buttons';
import moveTasksToTheTop from './features/tasks/move-tasks-top';
import hideTasksInOrder from './features/tasks/hide-tasks-in-order';
import setDealHasChanged from './features/orders/set-deal-has-changed';
import showCurrentOrder from './features/orders/show-current-order';
import hideSmsSenderType from './features/general/hide-sms-sender-type';
import validateTgLogin from './features/general/validate-tg-login';
import improveTasksForms from './features/tasks/improve-tasks';
import hideManagerOperationList from './features/processes/hide-manager-operation-list';
import changeManager from './features/general/change-manager';
import setOrderCancelReason from './features/orders/set-order-cancel-reason';
import hideSystemOrders from './features/orders/hide-system-orders';
import canEditProcesses from './features/processes/can-edit-processes';

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
				hideTaskDelayBtn: hideTaskDelayBtnValue,
				bigButtonsInTasks: bigButtonsInTasksValue,
				hideSmsSenderType: hideSmsSenderTypeValue,
				showCurrentOrder: showCurrentOrderValue,
				hideTasksInOrder: hideTasksInOrderConfig,
				hideManagerOperationList: hideManagerOperationListConfig,
				changeManager: changeManagerConfig,
				hideSystemOrders: hideSystemOrdersConfig,
				canEditProcesses: canEditProcessesConfig,
			} = this.config || {};

			taskOrder.forEach((config) => createOrderTask(config));
			hideTasksInOrder(hideTasksInOrderConfig);
			improveTasksForms();
			moveTasksToTheTop();
			hideManagerOperationList(hideManagerOperationListConfig);
			changeManager(changeManagerConfig);
			setOrderCancelReason();
			canEditProcesses(canEditProcessesConfig);

			if (!window?.recode?.gcPlugin?.validateTgLogin) {
				validateTgLogin();
			}

			if (!window?.recode?.gcModuleAnalytics && !window?.recode?.gcPlugin?.hideSystemOrders) {
				hideSystemOrders(hideSystemOrdersConfig);
			}

			if (dealHasChangedFieldId) {
				setDealHasChanged(dealHasChangedFieldId);
			}

			if (hideTrashInTasksValue === true) {
				hideTrashInTasks();
			}

			if (hideTaskDelayBtnValue === true) {
				hideTaskDelayBtn();
			}

			if (bigButtonsInTasksValue === true) {
				setBigButtonsInTasks();
			}

			if (!window?.recode?.gcPlugin?.hideSmsSenderType && hideSmsSenderTypeValue === true) {
				hideSmsSenderType();
			}

			if (showCurrentOrderValue === true) {
				showCurrentOrder();
			}
		},
	},
};
