/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */

import CONFIG from './core/config';
import MESSAGES from './core/messages';
import { createElement } from '../../../../../../utils/dom';
import registerEnhancement from '../common/register-enhancement';

const blockStatusChange = (selectElement) => {
  const originalValue = selectElement.value;

  selectElement.disabled = true;
  selectElement.style.opacity = '0.6';

  const container = createElement('div', {
    style: `
      position: relative;
      display: inline-block;
    `,
  });

  const overlay = createElement('div', {
    style: `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      cursor: not-allowed;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 16px;
    `,
  });

  const lockIcon = createElement('span', {
    textContent: '🔒',
    style: `
      font-size: 14px;
      opacity: 0.7;
      pointer-events: none;
    `,
  });

  overlay.appendChild(lockIcon);

  selectElement.parentElement.insertBefore(container, selectElement);
  container.appendChild(selectElement);
  container.appendChild(overlay);

  overlay.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    alert(MESSAGES.CANT_CHANGE_STATUS);
  });

  const observer = new MutationObserver(() => {
    if (!selectElement.disabled) {
      selectElement.disabled = true;
      selectElement.value = originalValue;
    }
  });

  observer.observe(selectElement, {
    attributes: true,
    attributeFilter: ['disabled'],
  });
};

const initBlockStatusChange = () => {
  registerEnhancement(CONFIG, CONFIG.SELECTORS.CHANGE_STATUS, blockStatusChange);
};

export default initBlockStatusChange;
