/**
 * Plugin Name: recodePlugin
 * Description: Плагин для GetCourse
 */

// Добавить в панель с заказами кнопку "Свернуть/Развернуть все"

import setConfig from './config/config';
import fillFormFieldsFromUrl from './features/forms/fill-form-fields-from-url';
import addTargetBlankInLinks from './features/general/add-target-blank-in-link';
import openWindowPageViewLink from './features/cms/open-window-page-view-link';
import reloadPageAfterTime from './utils/reload-after-time';
import redirectAfterTime from './utils/redirect-after-time';
import changePaymentType from './features/change-payment-type';
import improvePageWithFieldsSettings from './features/general/improve-fields-settings';
import resetFieldValue from './utils/reset-field-value';
import validateTgLogin from './utils/validate-tg-login';
import sendLessonAnswer from './utils/send-lesson-answer';
import hideSystemOrders from './features/general/hide-system-orders';
import addHiddenSections from './features/general/add-hidden-sections';
import disableOfferAutoMessage from './features/offer-settings/disable-auto-message';
import setOfferNds from './features/offer-settings/set-nds';
import hideLessonCommentBlock from './features/trainings/hide-lesson-comment-block';
import setSendAllMailingSettings from './features/mailing/set-send-to-all';
import hideExpectedPayments from './features/hide-expected-payments';
import addCopyProductButton from './features/cms/add-copy-product-button';
import changeEmail from './features/general/change-email';
import hideSmsSenderType from './features/general/hide-sms-sender-type';
import addToggleCollapseExpand from './features/general/add-toggle-collapse-expand';
import addRecoveryLinkForLessonBlocks from './features/trainings/add-recovery-link';
import validateOfferSettings from './features/offer-settings/validate-settings';
import autoSendForm from './features/forms/auto-send-form';
import hideTalksWidgetButton from './features/general/hide-talks-widget-button';
import hideTopNotification from './features/general/hide-top-notification';
import controlCheckboxesFields from './features/forms/control-checkbox-fields';

import * as processesImprovements from './features/processes/general';
import hideTechProducts from './features/paypage/general';

window.recode = {
	...(window.recode || {}),
	gcPlugin: {
		init(options = {}) {
			if (this.config) {
				throw new Error('RE-CODE STUDIO. Плагин для GetCourse. Повторная инициализация функционала невозможна');
			}

			this.config = setConfig(options);
			const {
				paymentSystems,
				hideSystemOrders: hideSystemOrdersConfig,
				disableOfferAutoMessage: disableOfferAutoMessageValue,
				hideLessonCommentBlock: hideLessonCommentBlockValue,
				changeEmail: changeEmailConfig,
				hideSmsSenderType: hideSmsSenderTypeValue,
				collapseExpand: collapseExpandConfig,
				controlCheckboxesFields: controlCheckboxesFieldsConfig,
			} = this.config || {};

			fillFormFieldsFromUrl();
			hideSystemOrders(hideSystemOrdersConfig);
			resetFieldValue();
			validateTgLogin();
			addToggleCollapseExpand(collapseExpandConfig);
			addTargetBlankInLinks();
			openWindowPageViewLink();
			changePaymentType(paymentSystems);
			improvePageWithFieldsSettings();
			addHiddenSections();
			setOfferNds();
			setSendAllMailingSettings();
			processesImprovements.changeNotOwnProcessMessage();
			processesImprovements.resetProcessTemplate();
			hideExpectedPayments();
			addCopyProductButton();
			changeEmail(changeEmailConfig);
			addRecoveryLinkForLessonBlocks();
			validateOfferSettings();
			autoSendForm();
			hideTalksWidgetButton();
			hideTopNotification();
			controlCheckboxesFields(controlCheckboxesFieldsConfig);
			hideTechProducts();

			if (hideSmsSenderTypeValue === true) {
				hideSmsSenderType();
			}

			if (disableOfferAutoMessageValue === true) {
				disableOfferAutoMessage();
			}

			if (hideLessonCommentBlockValue === true) {
				hideLessonCommentBlock();
			}
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
	},
};
