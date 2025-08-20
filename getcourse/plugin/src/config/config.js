import settings from './settings';

const GLOBAL_CONFIG = {};

const setConfig = (options) => ({
  hideLessonCommentBlock: options?.hideLessonCommentBlock ?? settings.hideLessonCommentBlock,
  hideSmsSenderType: options?.hideSmsSenderType ?? settings.hideSmsSenderType,
  hideTasksIfLength: options?.hideTasksIfLength ?? settings.hideTasksIfLength,
  changePaymentType: options?.changePaymentType ?? settings.changePaymentType,
  changePaymentList: options?.changePaymentList ?? settings.changePaymentList,
  hideSystemOrders: options?.hideSystemOrders || settings.hideSystemOrders,
  disableOfferAutoMessage: options?.disableOfferAutoMessage ?? settings.disableOfferAutoMessage,
  setOfferNds: options?.setOfferNds ?? settings.setOfferNds,
  changeEmail: settings.changeEmail,
  collapseExpand: options?.collapseExpand || settings.collapseExpand,
  controlCheckboxesFields: options?.controlCheckboxesFields ?? settings.controlCheckboxesFields.config,
  validateEmail: options?.validateEmail ?? settings.validateEmail,
  setSendAllMailingSettings: options?.setSendAllMailingSettings ?? settings.setSendAllMailingSettings,
  hideExpectedPayments: options?.hideExpectedPayments ?? settings.hideExpectedPayments,
  manageBlockActions: options?.manageBlockActions ?? settings.manageBlockActions,
});

const initConfig = (newConfig) => {
  Object.assign(GLOBAL_CONFIG, newConfig);
};

export { GLOBAL_CONFIG, initConfig, setConfig };
