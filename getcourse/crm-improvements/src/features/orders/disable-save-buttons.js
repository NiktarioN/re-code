/* eslint-disable no-param-reassign */

import { isDealPage } from '../../../../utils/page-checker';

const app = () => {
  if (!isDealPage) {
    return;
  }

  const buttons = document.querySelectorAll('.page-actions button.btn-primary, [name="save"]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('recode-disabled')) {
        return;
      }

      button.classList.add('recode-disabled');
      button.style.pointerEvents = 'none';

      setTimeout(() => {
        button.classList.remove('recode-disabled');
        button.style.pointerEvents = 'auto';
      }, 2000);
    });
  });
};

export default app;