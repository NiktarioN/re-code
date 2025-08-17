/* eslint-disable no-param-reassign */

import CONFIG from '../core/config';
import { CSS_PREFIX } from '../../../../config/constants';
import { clamp } from '../../../../../../../utils/math';
import { updateLocalSetting } from '../../../../modules/local-settings-manager';

const toggleTimeInputEditability = (input, isEnabled) => {
  input.readOnly = !isEnabled;
  input.classList.toggle(`${CSS_PREFIX}-input-disabled`, !isEnabled);
};

const updateMoscowTimeCheckboxes = (checked) => {
  document.querySelectorAll(`.${CONFIG.CLASSES.MOSCOW_TIME_CHECKBOX}`).forEach((checkbox) => {
    checkbox.checked = checked;
  });
};

const attachMoscowTimeHandler = (checkbox) => {
  checkbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    updateLocalSetting(CONFIG.SETTINGS_PATH.USE_MOSCOW_TIME, isChecked);
    updateMoscowTimeCheckboxes(isChecked);
  });
};

const attachAutoNotifyHandler = (checkbox, input) => {
  toggleTimeInputEditability(input, checkbox.checked);

  checkbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    updateLocalSetting(CONFIG.SETTINGS_PATH.AUTO_NOTIFY_IS_ENABLED, isChecked);
    toggleTimeInputEditability(input, checkbox.checked);
  });

  input.addEventListener('change', (event) => {
    const minutes = clamp(event.target.value, CONFIG.AUTO_NOTIFY.MIN, CONFIG.AUTO_NOTIFY.MAX);
    event.target.value = minutes;
    updateLocalSetting(CONFIG.SETTINGS_PATH.AUTO_NOTIFY_MINUTES, minutes);
  });
};

export { updateMoscowTimeCheckboxes, attachMoscowTimeHandler, attachAutoNotifyHandler };