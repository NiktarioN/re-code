/* eslint-disable no-param-reassign */

import { isLayoutPage } from '../../../../utils/page-checker';

import { isEmployee } from '../../../../utils/checks';
import { GLOBAL_CONFIG } from '../../config/config';

const FEATURE_CONFIG = {
  AUTO_STOP_DELAY: 5 * 60 * 1000, // 5 минут
};

const querySelectorAllByText = (searchString, rootNode = document.body) => {
  if (!rootNode) {
    return [];
  }

  if (!rootNode.childNodes.length) {
    const nodeText = rootNode.textContent?.toLowerCase() || '';
    const searchText = searchString.toLowerCase();
    return nodeText.includes(searchText) ? [rootNode] : [];
  }

  const foundNodes = [];
  const { childNodes } = rootNode;

  Array.from(childNodes).forEach((child) => {
    foundNodes.push(...querySelectorAllByText(searchString, child));
  });

  return foundNodes;
};

const processPaymentTypeReplacements = (paymentTypes) => {
  const sortedReplacements = [...paymentTypes].sort((a, b) => b[0].length - a[0].length);

  sortedReplacements.forEach(([oldPaymentSystem, newPaymentSystem]) => {
    const nodesWithText = querySelectorAllByText(oldPaymentSystem);
    nodesWithText.forEach((node) => {
      node.textContent = node.textContent.replaceAll(oldPaymentSystem, newPaymentSystem);
    });
  });
};

export const changePaymentType = () => {
  if (isLayoutPage || !isEmployee) {
    return;
  }

  const paymentTypes = GLOBAL_CONFIG.changePaymentType;

  if (!Array.isArray(paymentTypes)) {
    console.error('changePaymentType config is not an array');
    return;
  }

  processPaymentTypeReplacements(paymentTypes);

  const paymentTypeObserver = new MutationObserver(() => {
    processPaymentTypeReplacements(paymentTypes);
  });

  paymentTypeObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => {
    paymentTypeObserver.disconnect();
  }, FEATURE_CONFIG.AUTO_STOP_DELAY);
};
