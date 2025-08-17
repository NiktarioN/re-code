import CONFIG from '../../core/config';
import { PROJECT_LINK, PROJECT_NAME_SHORT } from '../../../../../config/constants';
import { createElement } from '../../../../../../../../utils/dom';
import createMoscowTimeCheckbox from './moscow-time-checkbox';
import createAutoNotifySection from './auto-notify';
import createOptionsContainer from './quick-delay-options';

const createSection = () => {
  const section = createElement('div', { class: CONFIG.CLASSES.QUICK_DELAY.SECTION });
  const title = createElement('h4', { class: CONFIG.CLASSES.QUICK_DELAY.TITLE });
  const link = createElement('a', {
    href: PROJECT_LINK,
    textContent: PROJECT_NAME_SHORT,
    target: '_blank',
    rel: 'noopener noreferrer',
  });

  const titleText = createElement('span', { textContent: ` ${CONFIG.SECTION_TITLE}` });
  title.append(link, titleText);

  const settings = createElement('div', { class: CONFIG.CLASSES.QUICK_DELAY.SETTINGS });
  const { wrapper: moscowCheckboxWrapper, checkbox: moscowCheckbox } = createMoscowTimeCheckbox();
  const { wrapper: autoNotify, checkbox: autoNotifyCheckbox, input: autoNotifyInput } = createAutoNotifySection();
  settings.append(autoNotify, moscowCheckboxWrapper);

  const delayOptions = createOptionsContainer();

  section.append(title, settings, delayOptions);

  return { delaySection: section, moscowCheckbox, autoNotifyCheckbox, autoNotifyInput, delayOptions };
};

export default createSection;
