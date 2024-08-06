const settings = {
	hideLessonCommentBlock: false,
	hideSmsSenderType: false,
	hideTasksIfLength: 3,
	disableOfferAutoMessage: false,
	setOfferNds: true,
	paymentSystems: [],
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
};

export default settings;
