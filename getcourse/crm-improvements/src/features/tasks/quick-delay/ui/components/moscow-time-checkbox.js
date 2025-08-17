import CONFIG from '../../core/config';
import { CLASSES } from '../../../../../config/constants';
import { createElement } from '../../../../../../../../utils/dom';
import { getLocalSetting } from '../../../../../modules/local-settings-manager';

const createMoscowTimeCheckbox = () => {
  const wrapper = createElement('div', { class: CLASSES.CHECKBOX_WRAPPER });
  const label = createElement('label', { textContent: CONFIG.TEXTS.USE_MOSCOW_TIME });
  const checkbox = createElement('input', {
    type: 'checkbox',
    class: CONFIG.CLASSES.MOSCOW_TIME_CHECKBOX,
    checked: getLocalSetting(CONFIG.SETTINGS_PATH.USE_MOSCOW_TIME),
  });

  label.prepend(checkbox);
  wrapper.append(label);

  return { wrapper, checkbox };
};

export default createMoscowTimeCheckbox;
