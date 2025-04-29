import { currentUrl } from '../../utils/url-utils';

const checkPage = (options) => {
  const {
    pages = [], // Массив страниц
    strict = false, // Строгая проверка на значение
    strictEnding = false, // Поиск строго по окончанию значения
    notMode = false, // Режим "не"
  } = options;

  const isTruePage = pages.some((page) => {
    const pageUrl = strict ? page : page.toLowerCase();
    const checkUrl = strict ? currentUrl.href : currentUrl.href.toLowerCase();

    return strictEnding ? checkUrl.endsWith(pageUrl) : checkUrl.includes(pageUrl);
  });

  return notMode ? !isTruePage : isTruePage;
};

const isDealPage = checkPage({ pages: ['/sales/control/deal/update/id/'] });
const isDealCreatePage = checkPage({ pages: ['/sales/control/deal/new'] });
const isUserControlPage = checkPage({ pages: ['/user/control/user/update/id/'] });
const isUserGroupControlPage = checkPage({ pages: ['/part/groups'], strictEnding: true });
const isGroupControlPage = checkPage({ pages: ['/pl/user/group/index', '/user/control/group/index'] });
const isTrainingTreeEditPage = checkPage({ pages: ['/teach/control/stream/tree/edit/1'] });
const isLessonPage = checkPage({ pages: ['/teach/control/lesson', 'answers/'] });
const isTrainingPage = checkPage({ pages: ['/teach/control'] });
const isEditMode = checkPage({ pages: ['/editable', '/editMode/1', 'editMode=1', '/editor?id'] });
const isCmsPage = window?.controllerId === 'page';
const isWidgetPage = window?.controllerId === 'widget';
const isSystemPage = window?.controllerId === 'system';
const isShopPage = window?.controllerId === 'shop';
const isOneLessonPage = window?.controllerId === 'control/lesson';
const isTrainingModulesPage = window?.controllerId === 'control/stream';
const isLayoutPage = window?.controllerId === 'layout';
const isTaskPage = window?.controllerId === 'task';

const isNotificationPage = checkPage({ pages: ['/pl/notifications/settings/my'] });
const isNotificationsControlPage = checkPage({ pages: ['/pl/notifications/control/'] });

const isPageWithFieldsSettings = checkPage({
  pages: ['/pl/logic/context/custom-fields', '/user/control/survey/update/id/', '/pl/teach/goal'],
});
const isPageWithRightUserCard = checkPage({
  pages: ['/pl/tasks', '/pl/sales/deal', '/pl/user/user/', '/user/control', '/sales/control', '/pl/tasks/resp'],
});
const isUserOrdersPage = checkPage({ pages: ['/sales/control/userProduct/my'] });

const isProcessesEditorPage = checkPage({
  pages: ['/pl/tasks/mission/index', '/pl/tasks/mission/draft', '/pl/tasks/mission/all', '/pl/tasks/mission/error'],
});
const isProcessEditorPage = checkPage({
  pages: [
    '/pl/tasks/mission/process',
    '/pl/tasks/mission/variables',
    '/pl/tasks/mission/update',
    '/pl/tasks/mission/tasks',
  ],
});
const isProcessesCreatePage = checkPage({ pages: ['/pl/tasks/mission/create'] });
const isSalesSettingsPage = checkPage({
  pages: [
    '/pl/sales/product',
    '/pl/sales/offer',
    '/pl/sales/preset',
    '/pl/sales/stream/stream-stat',
    '/pl/sales/modifier',
  ],
});
const isCmsSettingsPage = checkPage({
  pages: ['/pl/cms/', '/cms/control/page/settings', '/cms/control/page/payment'],
});

const isProductSettingsPage = checkPage({ pages: ['/pl/sales/product/update'] });

const isOneOfferSettingsPage = checkPage({ pages: ['/pl/sales/offer/update', '/pl/sales/offer/create'] });

const isMailingSettingsPage = checkPage({ pages: ['/notifications/control/mailings/update'] });
const isOneTaskControlPage = checkPage({ pages: ['/pl/tasks/task/view'] });
const isPageWithTasks = checkPage({
  pages: ['/pl/tasks', '/user/control', '/sales/control'],
});

const isWebsListPage = checkPage({ pages: ['/pl/webinar/control/index'] });
const isOneWebRoomPage = checkPage({ pages: ['/pl/webinar/show'] });
const isOneWebSettingsPage = checkPage({ pages: ['/pl/webinar/update'] });

const isPayPage = checkPage({ pages: ['/sales/shop/dealPay/id/'] });

const isOrdersListAndOthers = checkPage({
  pages: [
    '/pl/sales/deal/index',
    '/pl/sales/user-product/index',
    '/pl/sales/control/payment/index',
    '/pl/sales/control/online-receipt',
  ],
});

const isCanbanDealsPage = checkPage({ pages: ['/pl/tasks/task/kanban/deals'] });

const isPaymentPage = checkPage({ pages: ['/sales/shop/dealPay/id/'] });

const isHideTalksWidgetPage = checkPage({ pages: ['/pl/talks/conversation'] });
const isHideTopNotificationPage =
  isCmsPage ||
  isWidgetPage ||
  isSystemPage ||
  isShopPage ||
  isUserOrdersPage ||
  isProcessEditorPage ||
  isDealPage ||
  isTaskPage;

export {
  checkPage,
  isDealPage,
  isDealCreatePage,
  isUserControlPage,
  isEditMode,
  isLessonPage,
  isTrainingPage,
  isTrainingModulesPage,
  isPageWithFieldsSettings,
  isCmsPage,
  isOneLessonPage,
  isLayoutPage,
  isUserOrdersPage,
  isProcessesEditorPage,
  isProcessEditorPage,
  isSalesSettingsPage,
  isOneOfferSettingsPage,
  isCmsSettingsPage,
  isMailingSettingsPage,
  isPageWithRightUserCard,
  isUserGroupControlPage,
  isGroupControlPage,
  isTrainingTreeEditPage,
  isOneTaskControlPage,
  isPageWithTasks,
  isWebsListPage,
  isOneWebRoomPage,
  isOneWebSettingsPage,
  isHideTalksWidgetPage,
  isHideTopNotificationPage,
  isProcessesCreatePage,
  isPayPage,
  isProductSettingsPage,
  isNotificationPage,
  isNotificationsControlPage,
  isOrdersListAndOthers,
  isCanbanDealsPage,
  isPaymentPage,
};
