import { convertToBooleanOptions } from './constants';
import settings from './settings';

const setConfig = (options) => ({
	needHidePartialPayBlock:
		convertToBooleanOptions[options?.needHidePartialPayBlock] || settings.needHidePartialPayBlock,
	defaultTextForCustomPay: options?.defaultTextForCustomPay || settings.defaultTextForCustomPay,
});

export default setConfig;
