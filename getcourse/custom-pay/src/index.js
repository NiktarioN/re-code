/* eslint-disable no-console */

// TODO
// Сделать так, чтобы все считалось от итоговой суммы в предложении, а не прописывалось вручную
// Добавить надпись с кастомной оплатой, если в предложении указан custom-pay-text. Если указан класс, то парсим текст из него и прописываем иначе
// Выяснить почему не работает редирект на кастомную оплату на новых методах оплаты
// Доработать под виджет с оплатой не переходя на страницу с оплатой

/**
 * Plugin Name: GC Custom Pay
 * Description: Кастомная сумма оплаты
 */

import setConfig from './config/config';
import {
  customPayFuncSearchParam,
  hidePartialPayBlockSearchParam,
  partialPayFuncSearchParam,
  isPayPage,
  isNewPayPage,
  isOldPayPage,
  formsSelector,
} from './config/constants';
import { removeSearchParamFromHistory } from '../../../utils/url-utils';

import * as modules from './modules/general';

const gcCustomPay = {
  init(options = {}) {
    if (this.config) {
      throw new Error('RE-CODE AGENCY. Плагин gcCustomPay. Повторная инициализация функционала невозможна');
    }

    this.config = setConfig(options);

    const forms = document.querySelectorAll(formsSelector);
    if (!forms.length && !isPayPage) {
      console.log('RE-CODE AGENCY. Плагин gcCustomPay. Нет форм и это не страница оплаты. Выключаем плагин');
      return;
    }

    console.log('RE-CODE AGENCY. Плагин gcCustomPay. Успешная инициализация... Работаем');

    if (isPayPage) {
      modules.setupRedirects(this.config, modules, customPayFuncSearchParam, hidePartialPayBlockSearchParam, partialPayFuncSearchParam, isOldPayPage, isNewPayPage);
    }

    if (!isPayPage) {
      removeSearchParamFromHistory(window.location.href, [customPayFuncSearchParam, partialPayFuncSearchParam]);
    }
  },

  oneOffer(paymentCost) {
    modules.oneOffer(paymentCost);
  },

  manyOffers(nodeSelector) {
    modules.manyOffers(nodeSelector);
  },

  partialPay() {
    modules.partialPay();
  },
};

window.recode = {
  ...(window.recode || {}),
  gcCustomPay,
};