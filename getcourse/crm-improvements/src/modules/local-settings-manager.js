/* eslint-disable no-param-reassign */

import { PLUGIN_NAME, LOCAL_STORAGE_KEY } from '../config/constants';
import LOCAL_SETTINGS from '../config/local-settings';
import getNestedValue from '../utils/get-nested-value';

const pathToObject = (path, value) =>
  path
    .split('.')
    .reverse()
    .reduce((acc, key) => ({ [key]: acc }), value);

const deepMerge = (target, source) => {
  Object.keys(source).forEach((key) => {
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
};

const getLocalSettings = () => {
  try {
    const settings = localStorage.getItem(LOCAL_STORAGE_KEY);
    return settings ? JSON.parse(settings) : structuredClone(LOCAL_SETTINGS);
  } catch (error) {
    console.error(`${PLUGIN_NAME}. Ошибка при загрузке настроек (${LOCAL_STORAGE_KEY}):`, error);
    return structuredClone(LOCAL_SETTINGS);
  }
};

const getLocalSetting = (path) => {
  const settings = getLocalSettings();
  return getNestedValue(settings, path) ?? getNestedValue(LOCAL_SETTINGS, path);
};

const updateLocalSettings = (newSettings) => {
  try {
    const currentSettings = getLocalSettings();
    const updatedSettings = deepMerge(structuredClone(currentSettings), newSettings);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error(`${PLUGIN_NAME}. Ошибка при сохранении настроек (${LOCAL_STORAGE_KEY}):`, error);
  }
};

const updateLocalSetting = (path, value) => {
  const changes = pathToObject(path, value);
  updateLocalSettings(changes);
};

export { getLocalSettings, getLocalSetting, updateLocalSettings, updateLocalSetting };