const settings = {
  hideLessonCommentBlock: false,
  hideSmsSenderType: false,
  hideTasksIfLength: 3,
  disableOfferAutoMessage: false,
  setOfferNds: true,
  changePaymentType: [],
  hideSystemOrders: {
    searchWords: [
      'Тест',
      'Чекин',
      'Заявка',
      'Таблица',
      'Воронка',
      'Вебинар',
      'Техническ',
      'Системный',
      'Предсписок',
      'Предзапись',
      'Регистрация',
      'Авторизация',
      'systemic_',
      '[systemic]',
      '[тех]',
      'збо',
    ],
    hideFromEmpoyees: true,
  },
  changeEmail: {
    changeEmailBlockSelector: '.recode-change-email',
    newEmailFieldSelector: '.recode-new-email input.form-control',
  },
  collapseExpand: {
    collapseUserGroups: true,
  },
  controlCheckboxesFields: {
    config: [],
    checkedDefault: true,
  },
  validateEmail: {
    value: true,
    offerUserChoice: true,
  },
  setSendAllMailingSettings: false,
  // Скрытие лишних платежей, если заказ полностью оплачен
  hideExpectedPayments: true,
  // Показывать всегда или как обычно панель действий для сотрудников в блоках настроек
  manageBlockActions: true,
};

export default settings;
