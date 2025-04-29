/* eslint-disable no-param-reassign */

import { SELECTORS, PLUGIN_NAME, PROJECT_NAME_SHORT, PROJECT_LINK, CSS_PREFIX } from '../../config/constants';
import settings from '../../config/settings';
import { createElement } from '../../../../../utils/dom';
import { getSettings, updateSettings } from '../../modules/settings-manager';
import TaskDomObserver from '../../modules/task-dom-observer';

const CONFIG = {
  FEATURE_NAME: 'Быстрые варианты откладывания в задаче',
  SELECTORS: {
    BLOCK: '.task-delayed-script',
    TIME_INPUT: '.script-time.time-input',
    SAVE_BUTTON: '.save-change-time',
    CHANGE_TIME_BLOCK: '.change-time-block',
    EXCLUDE_DELAYED_TASK_SCRIPT: '.active-task-script-delayedTaskScript',
  },
  SECTION_TITLE: 'Быстрые варианты откладывания задачи',
};

const formatDate = (date) => {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка форматирования даты: `, error);
    return '';
  }
};

const getMoscowTime = () => {
  try {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const parts = formatter.formatToParts(now);
    const extract = (type) => parts.find((p) => p.type === type)?.value;

    const formattedDate = `${extract('year')}-${extract('month')}-${extract('day')}T${extract('hour')}:${extract(
      'minute'
    )}:${extract('second')}`;

    return new Date(formattedDate);
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка получения московского времени: `, error);
    return new Date();
  }
};

const addMinutes = (minutes, useMoscowTime) => {
  try {
    const baseDate = useMoscowTime ? getMoscowTime() : new Date();
    const resultDate = new Date(baseDate.getTime() + minutes * 60 * 1000);
    return formatDate(resultDate);
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка добавления минут: `, error);
    return formatDate(new Date());
  }
};

const updateAllCheckboxes = () => {
  const checkboxes = document.querySelectorAll(`.${CSS_PREFIX}-moscow-time-checkbox`);
  const {
    tasks: {
      quickDelay: { useMoscowTime },
    },
  } = getSettings();

  checkboxes.forEach((checkbox) => {
    checkbox.checked = useMoscowTime;
  });
};

const handleQuickDelayClick = (option, timeInput, useMoscowTime) => {
  try {
    timeInput.value = addMinutes(option.minutes, useMoscowTime);

    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    timeInput.dispatchEvent(changeEvent);

    const formContainer = timeInput.closest(CONFIG.SELECTORS.BLOCK);
    const saveButton = formContainer?.querySelector(CONFIG.SELECTORS.SAVE_BUTTON);

    if (saveButton) {
      saveButton.style.display = '';
    }
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка в установке времени: `, error);
  }
};

const createMoscowTimeCheckbox = () => {
  try {
    const container = createElement('div', { class: `${CSS_PREFIX}-checkbox-wrapper` });
    const label = createElement('label', { textContent: 'Откладывать задачу относительно МСК' });
    const checkbox = createElement('input', {
      type: 'checkbox',
      class: `${CSS_PREFIX}-moscow-time-checkbox`,
    });

    const {
      tasks: {
        quickDelay: { useMoscowTime },
      },
    } = getSettings();
    checkbox.checked = useMoscowTime;

    checkbox.addEventListener('change', () => {
      try {
        const current = getSettings();
        updateSettings({
          tasks: {
            ...current.tasks,
            quickDelay: {
              ...current.tasks.quickDelay,
              useMoscowTime: checkbox.checked,
            },
          },
        });
        updateAllCheckboxes();
      } catch (error) {
        console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка обновления настроек: `, error);
      }
    });

    label.prepend(checkbox);
    container.appendChild(label);

    return container;
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка создания чекбокса: `, error);
    return createElement('div');
  }
};

const createQuickDelaySection = (timeInput, quickDelayOptions) => {
  try {
    const section = createElement('div', { class: `${CSS_PREFIX}-quick-delay-section` });
    const title = createElement('h4', { class: `${CSS_PREFIX}-quick-delay-title` });
    const link = createElement('a', {
      href: PROJECT_LINK,
      textContent: PROJECT_NAME_SHORT,
      target: '_blank',
      rel: 'noopener noreferrer',
    });
    const titleText = createElement('span', { textContent: ` ${CONFIG.SECTION_TITLE}` });

    title.append(link, titleText);

    const optionsContainer = createElement('div', { class: `${CSS_PREFIX}-quick-delay-options` });

    quickDelayOptions.forEach((option) => {
      const optionElement = createElement('div', {
        class: `${CSS_PREFIX}-quick-delay-option`,
        textContent: option.label,
      });

      optionElement.addEventListener('click', () => {
        const {
          tasks: {
            quickDelay: { useMoscowTime },
          },
        } = getSettings();
        handleQuickDelayClick(option, timeInput, useMoscowTime);
      });

      optionsContainer.appendChild(optionElement);
    });

    section.append(title, createMoscowTimeCheckbox(), optionsContainer);

    return section;
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка создания секции: `, error);
    return createElement('div');
  }
};

const improveForm = (form, quickDelayOptions) => {
  try {
    const formTitleLowerCase = form.querySelector(SELECTORS.TASK.TITLE)?.textContent?.trim().toLowerCase();
    const stopWords = settings.hideTasksInOrder.searchWords;
    const hasStopWords = stopWords.some((word) => formTitleLowerCase.includes(word.toLowerCase()));

    if (hasStopWords) {
      return;
    }

    const existingSection = form.querySelector(`.${CSS_PREFIX}-quick-delay-section`);
    if (existingSection) {
      return;
    }

    const timeInput = form.querySelector(
      `.active-task-script:not(${CONFIG.SELECTORS.EXCLUDE_DELAYED_TASK_SCRIPT}) ${CONFIG.SELECTORS.TIME_INPUT}`
    );
    if (!timeInput) {
      return;
    }

    const delaySection = createQuickDelaySection(timeInput, quickDelayOptions);
    const timeChangeBlock = form.querySelector(
      `.active-task-script:not(${CONFIG.SELECTORS.EXCLUDE_DELAYED_TASK_SCRIPT}) ${CONFIG.SELECTORS.CHANGE_TIME_BLOCK}`
    );

    if (timeChangeBlock) {
      timeChangeBlock.prepend(delaySection);
    } else {
      form.appendChild(delaySection);
    }
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка улучшения формы: `, error);
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

const init = (config, forms) => {
  try {
    const quickDelayOptions = config || settings.tasks.quickDelay.options;
    const handleMutation = createMutationHandler(quickDelayOptions);
    const domObserver = new TaskDomObserver();

    forms.forEach((form) => {
      improveForm(form, quickDelayOptions);
      domObserver.subscribe(form, 'task-quick-delay', handleMutation);
    });
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FEATURE_NAME}. Ошибка инициализации: `, error);
  }
};

export default init;