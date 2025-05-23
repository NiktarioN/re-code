import settings from './settings';

const GLOBAL_CONFIG = {};

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
  hideTasksInOrder: {
    usersList: {
      idList: options?.hideTasksInOrder?.usersList?.idList ?? settings.hideTasksInOrder.usersList.idList,
      notMode: options?.hideTasksInOrder?.usersList?.notMode ?? settings.hideTasksInOrder.usersList.notMode,
    },
    searchWords: options?.hideTasksInOrder?.searchWords ?? settings.hideTasksInOrder.searchWords,
  },
  hideManagerOperationList: options?.hideManagerOperationList || settings.hideManagerOperationList,
  dealHasChangedFieldId: options?.dealHasChangedFieldId || settings.dealHasChangedFieldId,
  showCurrentOrder: options?.showCurrentOrder || settings.showCurrentOrder,
  hideTaskDelayBtn: correctHideTaskDelayBtn(options),
  bigButtonsInTasks: options?.bigButtonsInTasks || settings.improveTaskButtons,
  improveTaskButtons: options?.improveTaskButtons || settings.improveTaskButtons,
  hideSmsSenderType: options?.hideSmsSenderType || settings.hideSmsSenderType,
  changeManager: {
    idList: options?.changeManager?.idList ?? settings.changeManager.idList,
    notMode: options?.changeManager?.notMode ?? settings.changeManager.notMode,
  },
  hideSystemOrders: options?.hideSystemOrders || settings.hideSystemOrders,
  canEditProcesses: options?.canEditProcesses || settings.canEditProcesses,
  canSeeOrdersPage: options?.canSeeOrdersPage || settings.canSeeOrdersPage,
  websRights: options?.websRights || settings.websRights,
  reloadOrderPage: options?.reloadOrderPage || settings.reloadOrder,
  addDealComments: options?.addDealComments || settings.addDealComments,
  dealCommentsFieldId: options?.dealCommentsFieldId || settings.dealCommentsFieldId,
  validateOfferSettings: options?.validateOfferSettings || settings.validateOfferSettings,
  validateOfferChange: options?.validateOfferChange || settings.validateOfferChange,
  hideRightCardComments: options?.hideRightCardAddComments ?? settings.hideRightCardAddComments,
  tasks: {
    quickDelay: {
      isEnabled: options?.tasks?.quickDelay?.isEnabled || settings.tasks.quickDelay.isEnabled,
      options: options?.tasks?.quickDelay?.options || settings.tasks.quickDelay.options,
    },
    comments: {
      enableCommentLimit: options?.tasks?.comments?.enableCommentLimit ?? settings.tasks.comments.enableCommentLimit,
      enableButtonHighlight:
        options?.tasks?.comments?.enableButtonHighlight ?? settings.tasks.comments.enableButtonHighlight,
    },
  },
});

const initConfig = (newConfig) => {
  Object.assign(GLOBAL_CONFIG, newConfig);
};

export { GLOBAL_CONFIG, setConfig, initConfig };
