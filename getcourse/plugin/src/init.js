/**
 * Plugin Name: recodePlugin
 * Description: Плагин для GetCourse
 * Author: RE-CODE STUDIO
 * Author URL: https://techeducation.ru/y/8bbf221
 */

(() => {
  const intervalId = setInterval(() => {
    if (window?.recode?.gcPlugin) {
      clearInterval(intervalId);
      // Инициализируем функционал и прописываем настройки
      window.recode.gcPlugin.init({
        /**
         * Нужно ли скрывать блок "Комментарии" во всех уроках
         * Значение true - Включить настройку
         * Значение false - Выключить настройку
         */
        hideLessonCommentBlock: true,
        /**
         * Нужно ли в разделе "Общение с пользователем" скрывать метод отправки "Смс"
         * Значение true - Включить настройку
         * Значение false - Выключить настройку
         */
        hideSmsSenderTypeValue: true,
        /**
         * Нужно ли в настройках предложения всегда ставить галочку на "Не отправлять автоматическое письмо пользователю"
         * Значение true - Включить настройку
         * Значение false - Выключить настройку
         */
        disableOfferAutoMessageValue: true,
        /**
         * Нужно ли добавить валидацию email в формах
         */
        validateEmail: {
          /**
           * Включить или отключить настройку
           * Значение true - Включить настройку
           * Значение false - Выключить настройку
           */
          value: true,
          /**
           * Нужно ли предлагать пользователю заменить неккоретный email или делать это автоматически
           * Значение true - Предлагать пользователю заменить неккоректный email
           * Значение false - Заменять неккоректный email автоматически
           */
          offerUserChoice: true,
        },
        /**
         * Нужно ли всегда отправлять сообщение в рассылках EMAIL по всем и скрывать блок с выбором
         * Значение true - Включить настройку
         * Значение false - Выключить настройку
         */
        setSendAllMailingSettings: true,
      });
    }
  }, 100);
})();
