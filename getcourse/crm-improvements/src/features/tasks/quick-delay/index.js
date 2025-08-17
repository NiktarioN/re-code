import CONFIG from './core/config';
import { PLUGIN_NAME, SELECTORS } from '../../../config/constants';
import { GLOBAL_CONFIG } from '../../../config/config';
import TaskDomObserver from '../../../modules/task-dom-observer';
import { formHasSearchWords } from '../../../../../utils/checks';
import { attachMoscowTimeHandler, attachAutoNotifyHandler } from './handlers/settings-handlers';
import setupQuickDelayHandler from './handlers/quick-delay';
import renderQuickDelayUI from './ui/render';

const improveForm = (form) => {
  try {
    const uiElements = renderQuickDelayUI(form);
    if (!uiElements) {
      return;
    }

    const { timeInput, moscowCheckbox, autoNotifyCheckbox, autoNotifyInput, delayOptions } = uiElements;

    attachMoscowTimeHandler(moscowCheckbox);
    attachAutoNotifyHandler(autoNotifyCheckbox, autoNotifyInput);
    setupQuickDelayHandler(form, delayOptions, timeInput);
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка улучшения формы: `, error);
  }
};

const createMutationHandler = () => (mutations) => {
  try {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList') {
        return;
      }

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return;
        }

        const targetForm = node.closest(SELECTORS.TASK.FORM);
        if (targetForm) {
          improveForm(targetForm);
        }
      });
    });
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка в обработчике мутаций: `, error);
  }
};

const init = (forms) => {
  try {
    const domObserver = new TaskDomObserver();
    const handleMutation = createMutationHandler();

    forms.forEach((form) => {
      const hasSearchWords = formHasSearchWords(form, GLOBAL_CONFIG.hideTasksInOrder.searchWords);
      if (hasSearchWords) {
        return;
      }

      improveForm(form);
      domObserver.subscribe(form, 'task-quick-delay', handleMutation);
    });
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка инициализации: `, error);
  }
};

export default init;
