/**
 * Plugin Name: offer-payment-methods
 * Description: Плагин «Методы оплаты для предложений»
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

(() => {
  const intervalId = setInterval(() => {
    if (window?.recode?.offerPaymentMethods) {
      clearInterval(intervalId);
      // Инициализируем функционал и прописываем настройки

      /** Как работает METHODS_SHOW_MODE
       * 1 - Показать только выбранные метод/ы оплаты
       * 0 - Показать все методы оплаты, кроме выбранного/ых
       *
       * Значение по умолчанию: 1 (если 1, то можно не прописывать настройку)
       */
      window.recode.offerPaymentMethods.init({
        2944446: {
          METHODS: ['#prodamus_card'],
          METHODS_SHOW_MODE: 0,
        },
      });
    }
  }, 100);
})();