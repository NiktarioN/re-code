/* eslint-disable no-console */

import settings from '../../config/settings';
import { PLUGIN_NAME } from '../../config/constants';
import { isDealPage, isUserControlPage } from '../../../../utils/page-checker';
import { isNotEmptyArray } from '../../../../../utils/checks';
import { hasPermission } from '../../../../utils/checks';
import { getValueFromSelect } from '../../../../../utils/gets';
import { currentUrl } from '../../../../../utils/url-utils';

const CONFIG = {
  PATHNAME_AFTER_CREATE_DEAL: '/after_create/1'
}

const MESSAGES = {
  AFTER_CREATE_DEAL: `${PLUGIN_NAME}. Убираем ограничение на изменение менеджера в заказе после его создания`,
  HAS_PERMISSION: `${PLUGIN_NAME}. Есть разрешение на смену менеджера в заказе или в пользователе`,
  NO_PERMISSION: `${PLUGIN_NAME}. Нет разрешения на смену менеджера в заказе или в пользователе`,
};

const ELEMENTS_CLASSES = {
  managerLink: 'recode-manager-link',
  managerLinkNote: 'recode-manager-link--note',
  hide: 'hide',
  dealManagerSelector: '.manager-link',
  userControlManagerSelector: '[name="User[personal_manager_user_id]"]',
};

const STYLES = {
  managerLink: `
    margin-top: 5px;
    font-weight: bold;
  `,
};

const isValidConfig = (idList, notMode) => isNotEmptyArray(idList) && typeof notMode === 'boolean';

const createManagerNode = (text, extraClass = '') => {
  const node = document.createElement('span');
  node.classList.add('recode-manager-link');
  if (extraClass) {
    node.classList.add(extraClass);
  }
  node.textContent = text;

  return node;
};

const updateManagerSelect = (managerSelect, currentText, isUserControl = false) => {
  const currentManagerElement = createManagerNode(currentText);
  const noPermissionElement = createManagerNode(
    'Недостаточно прав для изменения менеджера',
    ELEMENTS_CLASSES.managerLinkNote
  );

  const { parentNode } = managerSelect;
  parentNode.appendChild(currentManagerElement);
  parentNode.appendChild(noPermissionElement);

  managerSelect.classList.add(ELEMENTS_CLASSES.hide);

  if (isUserControl) {
    currentManagerElement.style.cssText += STYLES.managerLink;
  }
};

const handleDealPage = () => {
  const managerSelect = document.querySelector(ELEMENTS_CLASSES.dealManagerSelector);
  if (managerSelect) {
    updateManagerSelect(managerSelect, managerSelect.textContent.trim());
  }
};

const handleUserControlPage = () => {
  const managerSelect = document.querySelector(ELEMENTS_CLASSES.userControlManagerSelector);
  if (managerSelect) {
    updateManagerSelect(managerSelect, getValueFromSelect(managerSelect), true);
  }
};

const app = (config) => {
  const idList = config.idList || settings.changeManager.idList;
  const notMode = config.notMode ?? settings.changeManager.notMode;

  if (!isValidConfig(idList, notMode) || !(isDealPage || isUserControlPage)) {
    return;
  }

  if (currentUrl.pathname.includes(CONFIG.PATHNAME_AFTER_CREATE_DEAL)) {
    console.log(MESSAGES.AFTER_CREATE_DEAL);
    return;
  }

  if (hasPermission(idList, notMode)) {
    console.log(MESSAGES.HAS_PERMISSION);
    return;
  }

  console.log(MESSAGES.NO_PERMISSION);

  if (isDealPage) {
    handleDealPage();
  }

  if (isUserControlPage) {
    handleUserControlPage();
  }
};

export default app;
