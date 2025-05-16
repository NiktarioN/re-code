/* eslint-disable no-console */

import { GLOBAL_CONFIG } from '../../config/config';
import { isDealPage, isUserControlPage } from '../../../../utils/page-checker';
import { isNotEmptyArray } from '../../../../../utils/checks';
import { hasPermission } from '../../../../utils/checks';
import { getValueFromSelect } from '../../../../../utils/gets';
import { currentUrl } from '../../../../../utils/url-utils';
import { CLASSES } from '../../config/constants';

const CONFIG = {
  PATHNAME_AFTER_CREATE_DEAL: '/after_create/1',
  CLASSES: {
    MANAGER_LINK: 'recode-manager-link',
    MANAGER_LINK_NOTE: 'recode-manager-link--note',
  },
  SELECTORS: {
    DEAL_MANAGER_SELECTOR: '.manager-link',
    USER_CONTROL_MANAGER: '[name="User[personal_manager_user_id]"]',
    USER_OPERATION_BUTTONS: [
      '[data-type="user_unset_personal_manager_operation"]',
      '[data-type="user_set_personal_manager"]',
      '[data-type="user_assign_personal_manager_operation"]',
    ],
  },
};

const STYLES = {
  MANAGER_LINK: `
    margin-top: 5px;
    font-weight: bold;
  `,
};

const isValidConfig = (idList, notMode) => isNotEmptyArray(idList) && typeof notMode === 'boolean';

const createManagerNode = (text, extraClass = '') => {
  const node = document.createElement('span');
  node.classList.add(CONFIG.CLASSES.MANAGER_LINK);

  if (extraClass) {
    node.classList.add(extraClass);
  }
  node.textContent = text;

  return node;
};

const updateManagerSelect = (managerSelect, currentText, isUserControl = false) => {
  const container = managerSelect.parentNode;

  const currentManagerElement = createManagerNode(currentText);
  const noPermissionElement = createManagerNode(
    'Недостаточно прав для изменения менеджера',
    CONFIG.CLASSES.MANAGER_LINK_NOTE
  );

  container.append(currentManagerElement, noPermissionElement);
  managerSelect.classList.add(CLASSES.HIDE);

  if (isUserControl) {
    currentManagerElement.style.cssText += STYLES.MANAGER_LINK;
  }
};

const handleDealPage = () => {
  const managerSelect = document.querySelector(CONFIG.SELECTORS.DEAL_MANAGER_SELECTOR);
  if (managerSelect) {
    updateManagerSelect(managerSelect, managerSelect.textContent.trim());
  }
};

const handleUserControlPage = () => {
  const managerSelect = document.querySelector(CONFIG.SELECTORS.USER_CONTROL_MANAGER);
  if (managerSelect) {
    updateManagerSelect(managerSelect, getValueFromSelect(managerSelect), true);
  }

  document
    .querySelectorAll(CONFIG.SELECTORS.USER_OPERATION_BUTTONS.join(', '))
    .forEach((element) => element.parentElement?.classList?.add(CLASSES.HIDE));
};

const init = () => {
  const { idList, notMode } = GLOBAL_CONFIG.changeManager;

  if (!isValidConfig(idList, notMode)) {
    return;
  }

  if (!isDealPage && !isUserControlPage) {
    return;
  }

  if (currentUrl.pathname.includes(CONFIG.PATHNAME_AFTER_CREATE_DEAL)) {
    return;
  }

  if (hasPermission(idList, notMode)) {
    return;
  }

  if (isDealPage) {
    handleDealPage();
  }

  if (isUserControlPage) {
    handleUserControlPage();
  }
};

export default init;
