import settings from './settings';

const setConfig = (options) => ({
	taskOrder: options?.taskOrder || settings.taskOrder,
	hideTasksInOrder: options?.hideTasksInOrder || settings.hideTasksInOrder,
	hideManagerOperationList: options?.hideManagerOperationList || settings.hideManagerOperationList,
	dealHasChangedFieldId: options?.dealHasChangedFieldId || settings.dealHasChangedFieldId,
	showCurrentOrder: options?.showCurrentOrder || settings.showCurrentOrder,
	hideTaskDelayBtn: options?.hideTaskDelayBtn || settings.hideTaskDelayBtn,
	bigButtonsInTasks: options?.bigButtonsInTasks || settings.improveTaskButtons,
	improveTaskButtons: options?.improveTaskButtons || settings.improveTaskButtons,
	hideSmsSenderType: options?.hideSmsSenderType || settings.hideSmsSenderType,
	changeManager: options?.changeManager || settings.changeManager,
	hideSystemOrders: options?.hideSystemOrders || settings.hideSystemOrders,
	canEditProcesses: options?.canEditProcesses || settings.canEditProcesses,
	websRights: options?.websRights || settings.websRights,
	reloadOrderPage: options?.reloadOrderPage || settings.reloadOrder,
});

export default setConfig;
