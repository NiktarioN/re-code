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
	hideTrashInTasks: true,
	hideTaskDelayBtn: false,
	bigButtonsInTasks: false,
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
	canEditProcesses: {
		idList: [],
		notMode: false,
		notAccessRedirectUrl: '/teach/control/stream',
	},
};

export default settings;
