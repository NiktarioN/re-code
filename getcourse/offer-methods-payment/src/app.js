/* eslint-disable no-console */

import { isPaymentPage } from '../../utils/page-checker';
import { isNumber } from '../../../utils/checks';
import { CONFIG } from './config';

const { PLUGIN_NAME } = CONFIG;

const hideElementsBySelector = (selector) => {
  const nodes = document.querySelectorAll(selector);
  nodes.forEach((node) => {
    node.classList.add('hide');
  });
};

const getPaymentMethodSelectors = (methodSelectors) => `
    .xdget-payform > form:not(${methodSelectors}),
    .xdget-customPayformMethods > div:not(${methodSelectors}),
    .xdget-customPayformMethods > form:not(${methodSelectors}),
    .xdget-payform > div:not(${methodSelectors}):not(.alternative-payments-block-main, .credit-payments-block,#alternative-methods-container),
    .alternative-payments-block > form:not(${methodSelectors}),
    .alternative-payments-block > div:not(${methodSelectors}),
    #alternative-methods-container > form:not(${methodSelectors}),
    #alternative-methods-container > div:not(${methodSelectors}),
    .payment-methods__content > form:not(${methodSelectors}),
    .payment-methods__content > div:not(${methodSelectors})
  `;

const validateConfig = (config) => {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Конфиг должен быть объектом');
  }

  Object.entries(config).forEach(([offerId, offerConfig]) => {
    if (!isNumber(offerId)) {
      throw new Error(`Offer ID "${offerId}" должен быть числом`);
    }

    if (!offerConfig || typeof offerConfig !== 'object') {
      throw new Error(`Конфиг для offerId "${offerId}" должен быть объектом`);
    }

    const { METHODS } = offerConfig;

    if (!METHODS || !Array.isArray(METHODS)) {
      throw new Error(`Поле METHODS для offerId "${offerId}" обязательно`);
    }

    if (METHODS.some((method) => typeof method !== 'string')) {
      throw new Error(`Поле METHODS для offerId "${offerId}" должно быть массивом строк`);
    }
  });
};

const app = (config) => {
  try {
    validateConfig(config);

    const isPaymentBlockExist = document.querySelector('.xdget-payform');

    if (!isPaymentPage || !isPaymentBlockExist) {
      return;
    }

    Object.entries(config).forEach(([offerId, { METHODS, METHODS_SHOW_MODE = 1 }]) => {
      const offer = document.querySelector(`.deal-positions li[data-offer-id='${offerId}']`);

      if (!offer) {
        return;
      }

      const methodSelectors = METHODS.join(', ');
      const finalSelectors = METHODS_SHOW_MODE === 1 ? getPaymentMethodSelectors(methodSelectors) : methodSelectors;
      console.info(`${PLUGIN_NAME}. Скрытие способов оплат для offerId "${offerId}":`, finalSelectors);

      hideElementsBySelector(finalSelectors);
    });
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${error.message}`);
  }
};

export default app;