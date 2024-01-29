import { defaultNotAccessPage } from './constants';

const setConfig = (options) => ({
	employees: options?.employees ?? [],
	notAccessPage: options?.notAccessPage || defaultNotAccessPage,
});

export default setConfig;
