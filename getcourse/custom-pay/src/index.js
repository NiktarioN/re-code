// TODO
// Сделать так, чтобы все считалось от итоговой суммы в предложении, а не прописывалось вручную
// Добавить надпись с кастомной оплатой, если в предложении указан custom-pay-text. Если указан класс, то парсим текст из него и прописываем иначе
// Выяснить почему не работает редирект на кастомную оплату на новых методах оплаты
// Доработать под виджет с оплатой не переходя на страницу с оплатой

/**
 * Plugin Name: GC Custom Pay
 * Description: Кастомная сумма оплаты
 * Version: 4.0
 */

import { customPayFuncSearchParam, hidePartialPayBlockSearchParam, isPayPage, formsSelector } from './config/constants';
import { currentUrl } from '../../../utils/url-utils';
import removeSearchParamCustomPay from './helpers/helpers';
import hidePartialblock from './modules/hide-partial-block';
import oneOffer from './modules/one-offer';
import manyOffers from './modules/many-offers';
import redirectToCustomPay from './modules/redirect-to-custom-pay';
import setConfig from './config/config';

window.recode = {
	...(window.recode || {}),
	gcCustomPay: {
		init(options = {}) {
			if (this.config) {
				throw new Error('RE-CODE STUDIO. Плагин gcCustomPay. Повторная инициализация функционала невозможна');
			}

			this.config = setConfig(options);

			const forms = document.querySelectorAll(formsSelector);
			if (!forms.length) {
				return;
			}

			if (isPayPage) {
				redirectToCustomPay(
					customPayFuncSearchParam,
					this.config.needHidePartialPayBlock,
					hidePartialPayBlockSearchParam
				);
				hidePartialblock(hidePartialPayBlockSearchParam);
			}

			if (!isPayPage) {
				removeSearchParamCustomPay(currentUrl.href, customPayFuncSearchParam);
			}
		},
		oneOffer,
		manyOffers,
	},
};
