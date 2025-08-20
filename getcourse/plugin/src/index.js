/**
 * Plugin Name: recodePlugin
 * Description: Плагин для GetCourse
 */

import { setConfig, initConfig } from './config/config';

import addTargetBlankInLinks from './features/general/add-target-blank-in-link';
import openWindowPageViewLink from './features/cms/open-window-page-view-link';
import reloadPageAfterTime from './utils/reload-after-time';
import redirectAfterTime from './utils/redirect-after-time';
import improvePageWithFieldsSettings from './features/general/improve-fields-settings';
import resetFieldValue from './utils/reset-field-value';
import validateTgLogin from './utils/validate-tg-login';
import sendLessonAnswer from './utils/send-lesson-answer';
import addHiddenSections from './features/general/add-hidden-sections';
import disableOfferAutoMessage from './features/offer-settings/disable-auto-message';
import setOfferNds from './features/offer-settings/set-nds';
import setSendAllMailingSettings from './features/mailing/set-send-to-all';
import addCopyProductButton from './features/cms/add-copy-product-button';
import changeEmail from './features/general/change-email';
import hideSmsSenderType from './features/general/hide-sms-sender-type';
import addToggleCollapseExpand from './features/general/add-toggle-collapse-expand';
// import validateOfferSettings from './features/offer-settings/validate-settings';
import hideTalksWidgetButton from './features/general/hide-talks-widget-button';
import hideTopNotification from './features/general/hide-top-notification';
import settingsFormController from './controlles/form-settings';

import * as general from './features/general/general';
import * as processes from './features/processes/general';
import * as trainings from './features/trainings/general';
import * as forms from './features/forms/general';

import { initDealsFunctions } from './features/deals/general';
import hideTechProducts from './features/paypage/general';

import resetCheckboxes from './features/func-helpers/reset-checkboxes';

const gcPlugin = {
  init(options = {}) {
    if (this.config) {
      throw new Error('RE-CODE STUDIO. Плагин для GetCourse. Повторная инициализация функционала невозможна');
    }

    this.config = setConfig(options);
    initConfig(this.config);

    const {
      hideSystemOrders: hideSystemOrdersConfig,
      disableOfferAutoMessage: disableOfferAutoMessageValue,
      hideLessonCommentBlock: hideLessonCommentBlockValue,
      changeEmail: changeEmailConfig,
      hideSmsSenderType: hideSmsSenderTypeValue,
      collapseExpand: collapseExpandConfig,
      controlCheckboxesFields: controlCheckboxesFieldsConfig,
      validateEmail: validateEmailConfig,
      setSendAllMailingSettings: setSendAllMailingSettingsValue,
      manageBlockActions: manageBlockActionsValue,
    } = this.config || {};

    resetFieldValue();
    validateTgLogin();
    addToggleCollapseExpand(collapseExpandConfig);
    addTargetBlankInLinks();
    openWindowPageViewLink();
    improvePageWithFieldsSettings();
    addHiddenSections();
    setOfferNds();
    if (setSendAllMailingSettingsValue === true) {
      setSendAllMailingSettings();
    }
    settingsFormController();

    initDealsFunctions();

    general.textareaAutoSize();
    general.addTypografBtn();
    general.hideSystemOrders(hideSystemOrdersConfig);
    general.tranferGridColumns();
    general.turnOffNotification();
    general.resetSegments();
    general.manageBlockActions(manageBlockActionsValue);

    processes.resetProcessTemplate();

    forms.fillFormFieldsFromUrl();
    forms.autoSendForm();
    forms.controlCheckboxesFields(controlCheckboxesFieldsConfig);
    if (validateEmailConfig?.value === true) {
      forms.validateEmail(validateEmailConfig);
    }

    trainings.addRecoveryLinkForLessonBlocks();
    if (hideLessonCommentBlockValue === true) {
      trainings.hideLessonCommentBlock();
    }

    addCopyProductButton();
    changeEmail(changeEmailConfig);
    hideTalksWidgetButton();
    hideTopNotification();
    hideTechProducts();

    if (hideSmsSenderTypeValue === true) {
      hideSmsSenderType();
    }

    if (disableOfferAutoMessageValue === true) {
      disableOfferAutoMessage();
    }
  },

  hideInfoLink() {
    // eslint-disable-next-line no-console
    console.log(`
        Вставь ссылку ниже в разрешение, позволяющее добавлять CSS код

        @import url('https://tech-borodach.pro/packages/getcourse/helpers/hide-information/style.css');
        `);
  },

  sendLessonAnswer(answerText = 'Задание выполнено') {
    sendLessonAnswer(answerText);
  },

  reloadPageAfterTime(seconds = 1) {
    reloadPageAfterTime(seconds);
  },

  redirectAfterTime(redirectUrl, seconds = 1) {
    redirectAfterTime(redirectUrl, seconds);
  },

  resetCheckboxes() {
    resetCheckboxes();
  },
};


window.recode = {
  ...(window.recode || {}),
  gcPlugin,
};