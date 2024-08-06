import settings from './settings';

const setConfig = (options) => ({
	hideLessonCommentBlock: options?.hideLessonCommentBlock ?? settings.hideLessonCommentBlock,
	hideSmsSenderType: options?.hideSmsSenderType ?? settings.hideSmsSenderType,
	hideTasksIfLength: options?.hideTasksIfLength ?? settings.hideTasksIfLength,
	paymentSystems: options?.paymentSystems ?? settings.paymentSystems,
	hideSystemOrders: options?.hideSystemOrders || settings.hideSystemOrders,
	disableOfferAutoMessage: options?.disableOfferAutoMessage ?? settings.disableOfferAutoMessage,
	setOfferNds: options?.setOfferNds ?? settings.setOfferNds,
	changeEmail: settings.changeEmail,
	collapseExpand: options?.collapseExpand || settings.collapseExpand,
	controlCheckboxesFields: options?.controlCheckboxesFields ?? settings.controlCheckboxesFields.config,
});

export default setConfig;
