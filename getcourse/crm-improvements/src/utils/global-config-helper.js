import { GLOBAL_CONFIG } from '../config/config';
import getNestedValue from './get-nested-value';

const isFeatureEnabled = (path) => Boolean(getNestedValue(GLOBAL_CONFIG, path));

const getGlobalSetting = (path) => getNestedValue(GLOBAL_CONFIG, path);

export { isFeatureEnabled, getGlobalSetting };