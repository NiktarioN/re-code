const settings = {
	taskOrder: [],
	hideTasksInOrder: {
		usersList: {
			idList: [],
			notMode: false,
		},
		searchWords: ['[TECH]'],
	},
	hideManagerOperationList: {
		idList: [],
		notMode: false,
	},
	changeManager: {
		idList: [],
		notMode: false,
	},
	dealHasChangedFieldId: undefined,
	showCurrentOrder: true,
	hideTaskDelayBtn: false,
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
};

export default settings;
