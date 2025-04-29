import { PLUGIN_NAME, LOCAL_STORAGE_KEY } from '../config/constants';

const defaultSettings = {
  tasks: {
    quickDelay: {
      useMoscowTime: false,
    },
    draftComment: '',
  },
};

const getSettings = () => {
  try {
    const settings = localStorage.getItem(LOCAL_STORAGE_KEY);
    const result = settings ? JSON.parse(settings) : structuredClone(defaultSettings);
    return result;
  } catch (error) {
    console.error(`${PLUGIN_NAME}. Ошибка при загрузке настроек (${LOCAL_STORAGE_KEY}):`, error);
    return structuredClone(defaultSettings);
  }
};

const updateSettings = (newSettings) => {
  try {
    const current = getSettings();
    const updated = { ...current, ...newSettings };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error(`${PLUGIN_NAME}. Ошибка при сохранении настроек (${LOCAL_STORAGE_KEY}):`, error);
  }
};

export { getSettings, updateSettings, LOCAL_STORAGE_KEY, defaultSettings };