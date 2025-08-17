import CONFIG from '../../core/config';
import { CLASSES } from '../../../../../config/constants';
import { createElement } from '../../../../../../../../utils/dom';
import { getLocalSetting } from '../../../../../modules/local-settings-manager';

const createAutoNotifySection = () => {
  const wrapper = createElement('div', { class: CLASSES.CHECKBOX_WRAPPER });
  const label = createElement('label', { textContent: CONFIG.TEXTS.AUTO_NOTIFY });
  const checkbox = createElement('input', {
    type: 'checkbox',
    class: CONFIG.CLASSES.AUTO_NOTIFY,
    checked: getLocalSetting(CONFIG.SETTINGS_PATH.AUTO_NOTIFY_IS_ENABLED),
  });

  const input = createElement('input', {
    type: 'number',
    class: CONFIG.CLASSES.AUTO_NOTIFY_DELAY,
    min: CONFIG.AUTO_NOTIFY.MIN,
    max: CONFIG.AUTO_NOTIFY.MAX,
    value: getLocalSetting(CONFIG.SETTINGS_PATH.AUTO_NOTIFY_MINUTES),
  });

  const minText = createElement('span', { textContent: 'мин.', style: 'font-size: 12px; color: #333' });

  label.prepend(checkbox)
  wrapper.append(label, input, minText);

  return { wrapper, checkbox, input };
};

export default createAutoNotifySection;
