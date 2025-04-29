/* eslint-disable no-param-reassign */

import { waitForElement } from '../../../../../utils/dom';
import { toUrlSearchParams } from '../../../../../utils/helpers';

const CONSTANTS = {
  SELECTORS: {
    LEFT_BAR: '.gc-account-leftbar',
    SUBMENU: '.gc-account-user-submenu-bar',
    SEGMENT_RULE: '.logic-rule-plugin input[type=hidden]',
    LINKS: {
      SALES: 'a[href="/sales/default/deals"]',
      USER: 'a[href="/pl/user/user/index"]',
    },
  },
  SUBMENU_CLASSES: {
    SALES: 'gc-account-user-submenu-bar-sales',
    USER: 'gc-account-user-submenu-bar-user',
  },
  REQUEST_PARAMS: {
    USER: {
      'uc[segment_id]': '',
      'uc[rule_string]': '',
    },
    DEAL: {
      'DealContext[segment_id]': '',
      'DealContext[rule_string]': '',
    },
  },
};

const updateLink = (submenu) => {
  const isSalesMenu = submenu.classList.contains(CONSTANTS.SUBMENU_CLASSES.SALES);
  const isUserMenu = submenu.classList.contains(CONSTANTS.SUBMENU_CLASSES.USER);
  if (!isSalesMenu && !isUserMenu) {
    return;
  }

  const linkSelector = isSalesMenu ? CONSTANTS.SELECTORS.LINKS.SALES : CONSTANTS.SELECTORS.LINKS.USER;

  const link = submenu.querySelector(linkSelector);
  if (!link) {
    return;
  }

  const params = isSalesMenu ? CONSTANTS.REQUEST_PARAMS.DEAL : CONSTANTS.REQUEST_PARAMS.USER;

  const updatedHref = `${isSalesMenu ? '/pl/sales/deal/index' : link.getAttribute('href')}?${toUrlSearchParams(
    params
  )}`;
  link.setAttribute('href', updatedHref);
};

const observeSubmenu = (submenu) => {
  if (!submenu) {
    return;
  }

  const observer = new MutationObserver(() => updateLink(submenu));

  observer.observe(submenu, {
    attributes: true,
    attributeFilter: ['class'],
  });
};

const initializeMenu = (leftBar) => {
  const submenu = leftBar.querySelector(CONSTANTS.SELECTORS.SUBMENU);
  if (!submenu) {
    return;
  }

  updateLink(submenu);
  observeSubmenu(submenu);
};

const app = async () => {
  const leftBar =
    document.querySelector(CONSTANTS.SELECTORS.LEFT_BAR) || (await waitForElement(CONSTANTS.SELECTORS.LEFT_BAR));
  if (!leftBar) {
    return;
  }

  initializeMenu(leftBar);
};

export default app;
