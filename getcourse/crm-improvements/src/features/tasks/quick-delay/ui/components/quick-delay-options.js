import { GLOBAL_CONFIG } from '../../../../../config/config';
import { createElement } from '../../../../../../../../utils/dom';
import CONFIG from '../../core/config';

const createOptionsContainer = () => {
  const quickDelayOptions = GLOBAL_CONFIG.tasks.quickDelay.options;
  const optionsContainer = createElement('div', { class: CONFIG.CLASSES.QUICK_DELAY.OPTIONS });

  quickDelayOptions.forEach(({ label, minutes }) => {
    const optionElement = createElement('div', {
      'class': CONFIG.CLASSES.QUICK_DELAY.OPTION,
      'textContent': label,
      'data-minutes': minutes,
    });

    optionsContainer.append(optionElement);
  });

  return optionsContainer;
};

export default createOptionsContainer;
