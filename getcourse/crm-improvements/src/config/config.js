import settings from './settings';

const setConfig = (options) => ({
	taskOrder: options?.taskOrder || settings.taskOrder,
	hideTasksInOrder: options?.hideTasksInOrder || settings.hideTasksInOrder,
	hideManagerOperationList: options?.hideManagerOperationList || settings.hideManagerOperationList,
	dealHasChangedFieldId: options?.dealHasChangedFieldId || settings.dealHasChangedFieldId,
	showCurrentOrder: options?.showCurrentOrder || settings.showCurrentOrder,
	hideTrashInTasks: options?.hideTrashInTasks || settings.hideTrashInTasks,
	hideTaskDelayBtn: options?.hideTaskDelayBtn || settings.hideTaskDelayBtn,
	bigButtonsInTasks: options?.bigButtonsInTasks || settings.bigButtonsInTasks,
	hideSmsSenderType: options?.hideSmsSenderType || settings.hideSmsSenderType,
	changeManager: options?.changeManager || settings.changeManager,
	hideSystemOrders: options?.hideSystemOrders || settings.hideSystemOrders,
	canEditProcesses: options?.canEditProcesses || settings.canEditProcesses,
});

export default setConfig;
