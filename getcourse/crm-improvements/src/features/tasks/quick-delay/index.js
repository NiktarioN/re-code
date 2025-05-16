import CONFIG from './core/config';
import { PLUGIN_NAME, SELECTORS } from '../../../config/constants';
import { GLOBAL_CONFIG } from '../../../config/config';
import TaskDomObserver from '../../../modules/task-dom-observer';
import { getLocalSetting, updateLocalSetting } from '../../../modules/local-settings-manager';
import { formHasSearchWords } from '../../../../../utils/checks';
import updateMoscowTimeCheckboxes from './handlers/update-checkboxes';
import createQuickDelaySection from './ui/section';
import quickDelayHandler from './handlers/quick-delay';

const improveForm = (form, quickDelayOptions) => {
  try {
    const existingSection = form.querySelector(`.${CONFIG.CLASSES.QUICK_DELAY.SECTION}`);
    if (existingSection) {
      return;
    }

    const timeInput = form.querySelector(
      `.active-task-script:not(${CONFIG.SELECTORS.EXCLUDE_DELAYED_TASK_SCRIPT}) ${CONFIG.SELECTORS.TIME_INPUT}`
    );
    if (!timeInput) {
      return;
    }

    const { section: delaySection, checkbox, optionsContainer } = createQuickDelaySection(quickDelayOptions);

    const timeBlock = form.querySelector(
      `.active-task-script:not(${CONFIG.SELECTORS.EXCLUDE_DELAYED_TASK_SCRIPT}) ${CONFIG.SELECTORS.CHANGE_TIME_BLOCK}`
    );

    if (timeBlock) {
      timeBlock.prepend(delaySection);
    } else {
      form.appendChild(delaySection);
    }

    checkbox.checked = getLocalSetting(CONFIG.SETTINGS_PATH.USE_MOSCOW_TIME);

    checkbox.addEventListener('change', (event) => {
      updateLocalSetting(CONFIG.SETTINGS_PATH.USE_MOSCOW_TIME, event.target.checked);
      updateMoscowTimeCheckboxes(event.target.checked);
    });

    quickDelayHandler(optionsContainer, timeInput)
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка улучшения формы:`, error);
  }
};

const createMutationHandler = (quickDelayOptions) => (mutations) => {
  try {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList') {
        return;
      }

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const targetForm = node.closest(SELECTORS.TASK.FORM);
          if (targetForm) {
            improveForm(targetForm, quickDelayOptions);
          }
        }
      });
    });
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка в обработчике мутаций: `, error);
  }
};

const init = (forms) => {
  try {
    const quickDelayOptions = GLOBAL_CONFIG.tasks.quickDelay.options;
    const domObserver = new TaskDomObserver();
    const handleMutation = createMutationHandler(quickDelayOptions);

    forms.forEach((form) => {
      const hasSearchWords = formHasSearchWords(form, GLOBAL_CONFIG.hideTasksInOrder.searchWords);
      if (hasSearchWords) {
        return;
      }

      improveForm(form, quickDelayOptions);
      domObserver.subscribe(form, 'task-quick-delay', handleMutation);
    });
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка инициализации:`, error);
  }
};

export default init;
