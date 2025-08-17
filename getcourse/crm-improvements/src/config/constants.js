import { checkPage } from '../../../utils/page-checker';

const PLUGIN_NAME = '[ RE-CODE AGENCY ] Плагин «Улучшение CRM»'
const CSS_PREFIX = 'recode';
const PROJECT_NAME = 'RE-CODE AGENCY'
const PROJECT_NAME_SHORT = '[RE-CODE]'
const PROJECT_NAME_SHORT_ALT = 'RE-CODE'
const PROJECT_LINK = 'https://t.me/recode_agency';
const LOCAL_STORAGE_KEY = 'recode-settings';

const SELECTORS = {
  TASK: {
    FORM: '.task-form',
    HEAD: '.task-title',
    OBJECT: '.task-object',
    JOBS: '.task-jobs',
    BODY: '.task-body',
    TITLE: '.task-title > a[href*="/pl/tasks/task/view"]',
  }
}

const CLASSES = {
  HIDE: 'hide',
  STATUS_SUCCESS: `${CSS_PREFIX}-status-success`,
  STATUS_ERROR: `${CSS_PREFIX}-status-error`,
  CHECKBOX_WRAPPER: `${CSS_PREFIX}-checkbox-wrapper`,
  ANIMATIONS: {
    PULSE: `${CSS_PREFIX}-pulse`,
  },
  DISABLED: `${CSS_PREFIX}-disabled`,
}

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
  SELECTORS,
  CLASSES,
  PLUGIN_NAME,
  PROJECT_NAME,
  PROJECT_NAME_SHORT,
  PROJECT_NAME_SHORT_ALT,
  CSS_PREFIX,
  PROJECT_LINK,
  LOCAL_STORAGE_KEY,
  dealFieldsNodeSelector,
  isUserProfilePage,
  isPageWithTasks,
  isPageWithDeals,
  isCmsPage,
  isCrmPage,
  isProcessPage,
};
