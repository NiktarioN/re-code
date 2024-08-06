/**
 * Plugin Name: gcCrmImprovements
 * Description: Улучшение CRM GetCourse
 */

import setConfig from './config/config';
import createOrderTask from './features/tasks/create-order-task';
import hideTrashInTasks from './features/tasks/hide-trash';
import hideTaskDelayBtn from './features/tasks/hide-delay-btn';
import improveTaskButtons from './features/tasks/improve-buttons';
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
import canEditProcesses from './features/rights/can-edit-processes';
import websRights from './features/rights/webs-rights';
import reloadOrderPage from './features/orders/reload-page';
import addHints from './features/general/add-hints';
// eslint-disable-next-line no-unused-vars
import rightUserCardController from './controlles/right-user-card';

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
				hideTaskDelayBtn: hideTaskDelayBtnValue,
				bigButtonsInTasks: bigButtonsInTasksValue,
				improveTaskButtons: improveTaskButtonsValue,
				hideSmsSenderType: hideSmsSenderTypeValue,
				showCurrentOrder: showCurrentOrderValue,
				hideTasksInOrder: hideTasksInOrderConfig,
				hideManagerOperationList: hideManagerOperationListConfig,
				changeManager: changeManagerConfig,
				hideSystemOrders: hideSystemOrdersConfig,
				canEditProcesses: canEditProcessesConfig,
				websRights: websRightsConfig,
				reloadOrderPage: reloadOrderPageValue,
			} = this.config || {};

			taskOrder.forEach((config) => createOrderTask(config));
			hideTasksInOrder(hideTasksInOrderConfig);
			improveTasksForms();
			moveTasksToTheTop();
			hideManagerOperationList(hideManagerOperationListConfig);
			changeManager(changeManagerConfig);
			setOrderCancelReason();
			canEditProcesses(canEditProcessesConfig);
			websRights(websRightsConfig);
			hideTrashInTasks();
			addHints();
			// rightUserCardController();

			if (dealHasChangedFieldId) {
				setDealHasChanged(dealHasChangedFieldId);
			}

			if (hideTaskDelayBtnValue === true) {
				hideTaskDelayBtn();
			}

			if (improveTaskButtonsValue === true || bigButtonsInTasksValue === true) {
				improveTaskButtons();
			}

			if (showCurrentOrderValue === true) {
				showCurrentOrder();
			}

			if (hideSmsSenderTypeValue === true) {
				hideSmsSenderType();
			}

			if (reloadOrderPageValue === true) {
				reloadOrderPage();
			}

			if (!window?.recode?.gcPlugin) {
				validateTgLogin();
			}

			if (!window?.recode?.gcModuleAnalytics && !window?.recode?.gcPlugin) {
				hideSystemOrders(hideSystemOrdersConfig);
			}
		},
	},
};
