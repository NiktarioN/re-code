import CONFIG from './config';
import { PLUGIN_NAME } from '../../../../config/constants';
import { getLocalSetting } from '../../../../modules/local-settings-manager';

const getMoscowTime = () => {
  try {
    const now = new Date();
    const moscowOffset = 3 * 60;
    const localOffset = -now.getTimezoneOffset();
    const offsetDiff = moscowOffset - localOffset;

    return new Date(now.getTime() + offsetDiff * 60 * 1000);
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка получения московского времени:`, error);
    return new Date();
  }
};

const addMinutes = (minutes, useMoscowTime) => {
  try {
    const baseDate = useMoscowTime ? getMoscowTime() : new Date();
    return new Date(baseDate.getTime() + minutes * 60 * 1000);
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка добавления минут:`, error);
    return new Date();
  }
};

const getUseMoscowTime = () => getLocalSetting(CONFIG.SETTINGS_PATH.USE_MOSCOW_TIME);

export { getMoscowTime, getUseMoscowTime, addMinutes };
