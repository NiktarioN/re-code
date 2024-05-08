import { checkPage } from '../../../../utils/page-checker';

const dealFieldsNodeSelector = '[name="Deal[valueSetString]"]';
const isDealPage = checkPage({ pages: ['/sales/control/deal/update/id/'] });
const isUserProfilePage = checkPage({ pages: ['/user/control'] });
const isPageWithTasks = checkPage({
	pages: ['/pl/tasks', '/user/control', '/sales/control'],
});
const isPageWithDeals = checkPage({
	pages: ['/pl/tasks', '/user/control', '/sales/control', '/pl/sales/deal'],
});
const isPageWithRightUserCard = checkPage({
	pages: ['/pl/tasks', '/pl/sales/deal', '/pl/user/user/', '/user/control', '/sales/control', '/pl/tasks/resp'],
});
const isCmsPage = ['page', 'show', 'control/stream', 'control/lesson'].some(
	(section) => window?.controllerId === section
);
const isCrmPage = ['task', 'kanban', 'user', 'deal', 'resp', 'control/deal', 'control/user'].some(
	(section) => window?.controllerId === section
);
const isProcessPage = ['mission'].some((section) => window?.controllerId === section);

export {
	dealFieldsNodeSelector,
	isDealPage,
	isUserProfilePage,
	isPageWithTasks,
	isPageWithDeals,
	isPageWithRightUserCard,
	isCmsPage,
	isCrmPage,
	isProcessPage,
};
