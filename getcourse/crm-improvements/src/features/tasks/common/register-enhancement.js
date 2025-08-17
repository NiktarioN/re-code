import TASKS_ENHANCEMENTS_MANAGER from './forms-manager';
import { isFeatureEnabled } from '../../../utils/global-config-helper';

const registerEnhancement = (config, selector, handler) => {
  if (config.SETTINGS_PATH && !isFeatureEnabled(config.SETTINGS_PATH)) {
    console.log(`❌ ${config.FEATURE_NAME} отключен в конфиге`);
    return;
  }

  console.log(`✅ ${config.FEATURE_NAME} регистрируется`);

  TASKS_ENHANCEMENTS_MANAGER.registerEnhancement(config.FEATURE_NAME_ID, {
    selector,
    handler,
    runOnce: config.BEHAVIOR?.RUN_ONCE ?? true,
    debounceMs: config.BEHAVIOR?.DEBOUNCE_MS,
    formFilter: config.FORM_FILTER,
  });
};

export default registerEnhancement;
