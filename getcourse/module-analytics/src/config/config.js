import settings from './settings';

const setConfig = (options) => ({
	fields: options?.fields ?? [],
	redirectMode: options?.redirectMode || settings.redirectMode,
	hideSystemOrders: {
		searchWords: options?.hideSystemOrders?.searchWords || settings.hideSystemOrders.searchWords,
		hideFromEmpoyees: options?.hideSystemOrders?.hideFromEmpoyees || settings.hideSystemOrders.hideFromEmpoyees,
	},
});

export default setConfig;
