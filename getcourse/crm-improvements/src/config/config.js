import settings from './settings';

const setConfig = (options) => ({
	taskOrder: options?.taskOrder || settings.taskOrder,
	hideTasksInOrder: options?.hideTasksInOrder || settings.hideTasksInOrder,
	hideManagerOperationList: options?.hideManagerOperationList || settings.hideManagerOperationList,
	dealHasChangedFieldId: options?.dealHasChangedFieldId || settings.dealHasChangedFieldId,
	showCurrentOrder: options?.showCurrentOrder || settings.showCurrentOrder,
	hideTrashInTasks: options?.hideTrashInTasks || settings.hideTrashInTasks,
	bigButtonsInTasks: options?.bigButtonsInTasks || settings.bigButtonsInTasks,
	hideSmsSenderType: options?.hideSmsSenderType || settings.hideSmsSenderType,
	changeManagerInOrder: options?.changeManagerInOrder || settings.changeManagerInOrder,
});

export default setConfig;
