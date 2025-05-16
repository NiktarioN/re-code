/**
 * Plugin Name: gcCrmImprovements
 * Description: Улучшение CRM GetCourse
 */

import { setConfig, initConfig } from './config/config';
import { SELECTORS } from './config/constants';
import createOrderTask from './features/tasks/create-order-task';
import improveTaskButtons from './features/tasks/improve-buttons';
import moveTasksToTheTop from './features/tasks/move-tasks-top';
import hideTasksInOrder from './features/tasks/hide-tasks-in-order';
import setDealHasChanged from './features/orders/set-deal-has-changed';
import showCurrentOrder from './features/orders/show-current-order';
import hideSmsSenderType from './features/general/hide-sms-sender-type';
import improveTasksForms from './features/tasks/improve-tasks';
import hideSystemOrders from './features/orders/hide-system-orders';
import addHints from './features/general/add-hints';
import validateOfferSettings from './features/offer-settings/general';

import * as general from './features/general/general';
import * as orders from './features/orders/general';
import * as rights from './features/rights/general';
import * as automation from './automation/general';
import * as tasks from './features/tasks/general';
import * as processes from './features/processes/general';

const gcCrmImprovements = {
  init(options = {}) {
    if (this.config) {
      throw new Error('RE-CODE STUDIO. Плагин gcCrmImprovements. Повторная инициализация функционала невозможна');
    }

    console.log(options);
    this.config = setConfig(options);
    initConfig(this.config || {});

    const {
      taskOrder: taskOrderConfig,
      dealHasChangedFieldId,
      hideTaskDelayBtn: hideTaskDelayBtnConfig,
      bigButtonsInTasks: bigButtonsInTasksValue,
      improveTaskButtons: improveTaskButtonsValue,
      hideSmsSenderType: hideSmsSenderTypeValue,
      showCurrentOrder: showCurrentOrderValue,
      hideTasksInOrder: hideTasksInOrderConfig,
      hideManagerOperationList: hideManagerOperationListConfig,
      hideSystemOrders: hideSystemOrdersConfig,
      canSeeOrdersPage: canSeeOrdersPageConfig,
      canEditProcesses: canEditProcessesConfig,
      websRights: websRightsConfig,
      addDealComments: addDealCommentsConfig,
      validateOfferSettings: validateOfferSettingsConfig,
      dealCommentsFieldId,
      validateOfferChange: validateOfferChangeValue,
      tasks: tasksConfig,
    } = this.config || {};

    validateOfferSettings(validateOfferSettingsConfig);

    general.watchFieldsInputChanges();
    general.addDateInCommentsField(dealCommentsFieldId);

    createOrderTask(taskOrderConfig);
    hideTasksInOrder(hideTasksInOrderConfig);
    improveTasksForms();
    moveTasksToTheTop();

    rights.changeManager();
    rights.canSeeOrdersPage(canSeeOrdersPageConfig);
    rights.canEditProcesses(canEditProcessesConfig);
    rights.websRights(websRightsConfig);

    // Функции для форм с задачами
    const tasksForms = document.querySelectorAll(SELECTORS.TASK.FORM);
    if (tasksForms.length) {
      tasks.hideTrash();
      tasks.disableResultButtons();
      tasks.addComment(tasksForms);

      general.hideRightCardAddComments();

      if (tasksConfig.quickDelay.isEnabled === true) {
        tasks.quickDelay(tasksForms);
      }

      if (hideTaskDelayBtnConfig.value === true) {
        tasks.hideDelayBtn(hideTaskDelayBtnConfig);
      }
    }
    addHints();

    if (dealHasChangedFieldId) {
      setDealHasChanged(dealHasChangedFieldId);
    }

    orders.validateDealCreate();
    orders.setOrderCancelReason();
    orders.setOrderCancelReasonForm();
    orders.validateDealComment();
    orders.addDealComments(addDealCommentsConfig);
    orders.disableSaveButtons();

    if (validateOfferChangeValue) {
      orders.validateOfferChange();
    }

    processes.hideManagerOperationList(hideManagerOperationListConfig);
    processes.addNewSettings();
    processes.changeNotOwnProcessMessage();

    if (improveTaskButtonsValue === true || bigButtonsInTasksValue === true) {
      improveTaskButtons();
    }

    if (showCurrentOrderValue === true) {
      showCurrentOrder();
    }

    if (hideSmsSenderTypeValue === true) {
      hideSmsSenderType();
    }

    if (!window?.recode?.gcModuleAnalytics && !window?.recode?.gcPlugin) {
      hideSystemOrders(hideSystemOrdersConfig);
    }
  },

  createFields(key) {
    automation.createFields(key);
  },

  createProcesses() {
    automation.createProcesses();
  },

  createCancelReasons() {
    automation.createCancelReasons();
  },
};

window.recode = {
  ...(window.recode || {}),
  gcCrmImprovements,
};