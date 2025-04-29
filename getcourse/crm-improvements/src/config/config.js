import settings from './settings';

const correctHideTaskDelayBtn = (options) => {
  if (options.hideTaskDelayBtn === true) {
    return settings.hideTaskDelayBtn;
  }
  if (options.hideTaskDelayBtn === false) {
    return {
      value: false,
      mode: 'all',
    };
  }
  return options?.hideTaskDelayBtn || settings.hideTaskDelayBtn;
};

const setConfig = (options) => ({
  taskOrder: options?.taskOrder || settings.taskOrder,
  hideTasksInOrder: options?.hideTasksInOrder || settings.hideTasksInOrder,
  hideManagerOperationList: options?.hideManagerOperationList || settings.hideManagerOperationList,
  dealHasChangedFieldId: options?.dealHasChangedFieldId || settings.dealHasChangedFieldId,
  showCurrentOrder: options?.showCurrentOrder || settings.showCurrentOrder,
  hideTaskDelayBtn: correctHideTaskDelayBtn(options),
  bigButtonsInTasks: options?.bigButtonsInTasks || settings.improveTaskButtons,
  improveTaskButtons: options?.improveTaskButtons || settings.improveTaskButtons,
  hideSmsSenderType: options?.hideSmsSenderType || settings.hideSmsSenderType,
  changeManager: options?.changeManager || settings.changeManager,
  hideSystemOrders: options?.hideSystemOrders || settings.hideSystemOrders,
  canEditProcesses: options?.canEditProcesses || settings.canEditProcesses,
  canSeeOrdersPage: options?.canSeeOrdersPage || settings.canSeeOrdersPage,
  websRights: options?.websRights || settings.websRights,
  reloadOrderPage: options?.reloadOrderPage || settings.reloadOrder,
  addDealComments: options?.addDealComments || settings.addDealComments,
  dealCommentsFieldId: options?.dealCommentsFieldId || settings.dealCommentsFieldId,
  validateOfferSettings: options?.validateOfferSettings || settings.validateOfferSettings,
  validateOfferChange: options?.validateOfferChange || settings.validateOfferChange,
  tasks: {
    quickDelay: {
      isEnabled: options?.tasks?.quickDelay?.isEnabled || settings.tasks.quickDelay.isEnabled,
      options: options?.tasks?.quickDelay?.options || settings.tasks.quickDelay.options,
    }
  }
});

export default setConfig;
