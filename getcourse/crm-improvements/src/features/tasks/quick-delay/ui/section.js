import CONFIG from '../core/config';
import { PROJECT_LINK, PROJECT_NAME_SHORT, CLASSES } from '../../../../config/constants';
import { createElement } from '../../../../../../../utils/dom';

const createQuickDelaySection = (quickDelayOptions) => {
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

  const checkboxWrapper = createElement('div', { class: CLASSES.CHECKBOX_WRAPPER });
  const checkboxLabel = createElement('label', { textContent: CONFIG.TEXTS.USE_MOSCOW_TIME });
  const checkbox = createElement('input', {
    type: 'checkbox',
    class: CONFIG.CLASSES.MOSCOW_TIME_CHECKBOX,
  });

  checkboxLabel.prepend(checkbox);
  checkboxWrapper.appendChild(checkboxLabel);

  const optionsContainer = createElement('div', { class: CONFIG.CLASSES.QUICK_DELAY.OPTIONS });

  quickDelayOptions.forEach(({ label: labelOption, minutes }) => {
    const optionElement = createElement('div', {
      class: CONFIG.CLASSES.QUICK_DELAY.OPTION,
      textContent: labelOption,
      'data-minutes': minutes,
    });
    optionsContainer.appendChild(optionElement);
  });

  section.append(title, checkboxWrapper, optionsContainer);

  return { section, checkbox, optionsContainer };
};

export default createQuickDelaySection;