const setConfig = (options) => ({
	taskOrder: options?.taskOrder || [],
	dealHasChangedFieldId: options?.dealHasChangedFieldId || undefined,
	showCurrentOrder: options?.showCurrentOrder || true,
	hideTrashInTasks: options?.hideTrashInTasks || false,
	bigButtonsInTasks: options?.bigButtonsInTasks || false,
	hideSmsSenderType: options?.hideSmsSenderType || false,
});

export default setConfig;
