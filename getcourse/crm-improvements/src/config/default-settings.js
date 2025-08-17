const settings = {
  taskOrder: [],
  hideTasksInOrder: {
    usersList: {
      idList: [],
      notMode: false,
    },
    searchWords: ['[TECH]'],
  },
  moveTasksToTheTop: {
    searchWords: ['[ОП]'],
  },
  hideManagerOperationList: {
    idList: [],
    notMode: false,
  },
  changeManager: {
    idList: [],
    notMode: false,
  },
  dealCommentsFieldId: undefined,
  showCurrentOrder: true,
  hideTaskDelayBtn: {
    value: true,
    mode: 'all',
  },
  improveTaskButtons: false,
  hideSmsSenderType: false,
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
  reloadOrderPage: false,
  canEditProcesses: {
    idList: [],
    notMode: false,
    notAccessRedirectUrl: '/teach/control/stream',
  },
  websRights: {
    idList: [],
    notMode: false,
    notAccessRedirectUrl: '/teach/control/stream',
  },

  canSeeOrdersPage: {
    idList: [],
    notMode: false,
    notAccessRedirectUrl: '/teach/control/stream',
  },

  // Возможность добавлять комментарии через задачи
  addDealComments: {
    dealCommentsFieldId: undefined,
    mode: 'custom-field',
  },

  // Валидация настроек предложения
  validateOfferSettings: {
    isEnabled: false, // Включить валидацию
    offerCode: {
      isEnabled: false, // Включить валидацию кода предложения
    },
    cancelReason: {
      isEnabled: false, // Включить валидацию причины отмены заказа
      strictMode: false, // Использовать строгий режим. Ставит сам значения по умолчанию
      ids: {
        paid: undefined, // ID причины отмены для платного предложения
        free: undefined, // ID причины отмены для бесплатного предложения
      }
    },
    tags: {
      isEnabled: false, // Включить валидацию тегов в предложении
      requiredPrefixesTags: ['воронка_', 'тип_', 'продукт_'], // Префиксы тегов, которые должны быть в предложении
      excludedPrefixesTags: ['тех_'], // Префиксы тегов, которые не проверяем в предложении
    },
    sendAdminMessage: {
      isEnabled: false, // Включить валидацию отправки сообщения администратору о создании заказа
      defaultValue: 0,
      mode: 'all-offers', // Мод для валидации: all-offers | free-offers
    },
    sendUserMessage: {
      isEnabled: false, // Включить валидацию отправки сообщения пользователю после создания заказа
      defaultValue: 0,
      mode: 'free-offers', // Мод для валидации: all-offers | free-offers
    }
  },

  validateOfferChange: false,

  tasks: {
    quickDelay: {
      isEnabled: false,
      options: [
        { label: '15 минут', minutes: 15 },
        { label: '30 минут', minutes: 30 },
        { label: '1 час', minutes: 60 },
        { label: '3 часа', minutes: 180 },
        { label: '6 часов', minutes: 360 },
        { label: '24 часа', minutes: 1440 },
        { label: '48 часов', minutes: 2880 },
        { label: '72 часа', minutes: 4320 },
      ],
    },
    comments: {
      enableCommentLimit: true,
      enableButtonHighlight: false,
    },
    changeDealStatus: true,
  },
  hideRightCardAddComments: false,
};

export default settings;
