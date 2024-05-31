import { checkPage } from '../../../../utils/page-checker';

const dealFieldsNodeSelector = '[name="Deal[valueSetString]"]';
const isUserProfilePage = checkPage({ pages: ['/user/control'] });
const isPageWithTasks = checkPage({
	pages: ['/pl/tasks', '/user/control', '/sales/control'],
});
const isPageWithDeals = checkPage({
	pages: ['/pl/tasks', '/user/control', '/sales/control', '/pl/sales/deal'],
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
	isUserProfilePage,
	isPageWithTasks,
	isPageWithDeals,
	isCmsPage,
	isCrmPage,
	isProcessPage,
};
