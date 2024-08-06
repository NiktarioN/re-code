const pageChecker = () => {
	const pages = {
		'/pl/notifications/settings/my': 'isMyNotificationsPage',
		'/fileservice/control/account': 'isFileStoragePage',
		'/pl/tasks/mission/': 'isTasksPage',
		'/pl/cms/page': 'isPagesPage',
		'/pl/cms/layout': 'isLayoutPage',
		'/pl/lite/widget': 'isWidgetPage',
		'/cms/system/login': 'isLoginPage',
		'/control/lesson': 'isLessonPage',
		'/control/stream': 'isTrainingsPage',
		'/control/mailings': 'isMailingsPage',
		'/pl/teach/control/schedule': 'isShedulePage',
		'/pl/user/group/index': 'isGroupsPage',
	};

	Object.entries(pages).forEach(([key, value]) => {
		if (window.location.href.includes(key)) {
			document.querySelector('body')?.classList.add(value);
		}
	});
};

export default pageChecker;
