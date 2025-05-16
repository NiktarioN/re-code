/* eslint-disable no-param-reassign */

import CONFIG from '../core/config';

const updateMoscowTimeCheckboxes = (checked) => {
  document.querySelectorAll(`.${CONFIG.CLASSES.MOSCOW_TIME_CHECKBOX}`).forEach((checkbox) => {
    checkbox.checked = checked;
  });
};

export default updateMoscowTimeCheckboxes;