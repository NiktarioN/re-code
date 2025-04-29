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
  addDealComments: {
    dealCommentsFieldId: undefined,
    mode: 'custom-field',
  },
  validateOfferSettings: {
    tags: false,
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
  },
};

export default settings;