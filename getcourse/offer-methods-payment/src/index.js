/**
 * Plugin Name: offer-payment-methods
 * Description: Плагин «Методы оплаты для предложений»
 */

import { CONFIG } from './config';
import app from './app';

const offerPaymentMethods = {
  init(options = {}) {
    if (this.config) {
      throw new Error(`${CONFIG.PLUGIN_NAME}. Повторная инициализация функционала невозможна`);
    }

    this.config = options;
    app(this.config);
  },
};

window.recode = {
  ...(window.recode || {}),
  offerPaymentMethods,
};