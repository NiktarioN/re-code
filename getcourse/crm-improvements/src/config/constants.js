import pageChecker from '../../../../utils/page-checker';

const dealFieldsNodeSelector = '[name="Deal[valueSetString]"]';
const isDealPage = pageChecker({ pages: ['/sales/control/deal/update/id/'] });
const isPageWithTasks = pageChecker({
	pages: ['/pl/tasks', '/user/control', '/sales/control'],
});
const isPageWithRightUserCard = pageChecker({
	pages: ['/pl/tasks', '/pl/sales/deal', '/pl/user/user/', '/user/control', '/sales/control', '/pl/tasks/resp'],
});
const isCmsPage = ['page', 'show', 'control/stream', 'control/lesson'].some(
	(section) => window?.controllerId === section
);

export { dealFieldsNodeSelector, isDealPage, isPageWithTasks, isPageWithRightUserCard, isCmsPage };
