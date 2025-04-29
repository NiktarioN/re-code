/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */

import settings from '../../config/settings';
import { PROJECT_NAME_SHORT, PROJECT_LINK, CSS_PREFIX } from '../../config/constants';
import { currentUrl } from '../../../../../utils/url-utils';
import { createSetting } from '../../../../utils/create';

const CONFIG = {
  PATHNAME_PAGE: ['/pl/tasks/mission/update', '/pl/tasks/mission/create'],
  SELECTORS: {
    PROCESS_TITLE_ELEMENT: '.field-mission-title',
    PROCESS_TITLE: '[name="Mission[title]"]',
  },
  TAGS: {
    TECH: settings.hideTasksInOrder.searchWords,
    OP: settings.moveTasksToTheTop.searchWords,
  },
  CLASSES: {
    SETTINGS_CONTAINER: `${CSS_PREFIX}-settings-container`,
    SETTINGS_TITLE: `${CSS_PREFIX}-settings-container-title`,
    SETTING_WRAPPER: `${CSS_PREFIX}-setting-wrapper`,
    TOOLTIP: `${CSS_PREFIX}-tooltip`,
    TOOLTIP_TEXT: `${CSS_PREFIX}-tooltip-text`,
  },
  TOOLTIPS: {
    TECH: 'При включении этой настройки процесс будет скрываться от сотрудников, которые не должны его видеть',
    OP: 'При включении этой настройки задача по процессу выделится в рамочку и будет выше других задач в карточке объекта',
  },
};

const MESSAGES = {
  CONFLICT: 'Процесс не может быть одновременно техническим и для отдела продаж. Нужно выбрать что-то одно',
  TAG_CONFLICT:
    'Обнаружены конфликтующие теги (в квадратных скобках в конце) в названии процесса. Оставьте только один',
};

const createSettingsContainer = () => {
  const container = document.createElement('div');
  container.classList.add(CONFIG.CLASSES.SETTINGS_CONTAINER);

  const recodeLink = document.createElement('a');
  recodeLink.href = PROJECT_LINK;
  recodeLink.textContent = PROJECT_NAME_SHORT;
  recodeLink.target = '_blank';
  recodeLink.rel = 'noopener noreferrer';

  const textSpan = document.createElement('span');
  textSpan.textContent = ' Дополнительные настройки';

  const titleSpan = document.createElement('span');
  titleSpan.classList.add(CONFIG.CLASSES.SETTINGS_TITLE);
  titleSpan.appendChild(recodeLink);
  titleSpan.appendChild(textSpan);

  container.appendChild(titleSpan);

  return container;
};

const createTooltip = (text) => {
  const tooltip = document.createElement('span');
  tooltip.classList.add(CONFIG.CLASSES.TOOLTIP);

  const tooltipText = document.createElement('span');
  tooltipText.classList.add(CONFIG.CLASSES.TOOLTIP_TEXT);
  tooltipText.textContent = text;
  tooltip.appendChild(tooltipText);

  return tooltip;
};

const createSettingWithTooltip = (id, label, tooltipText) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add(CONFIG.CLASSES.SETTING_WRAPPER);

  const setting = createSetting(id, label);
  const tooltip = createTooltip(tooltipText);

  wrapper.appendChild(setting);
  wrapper.appendChild(tooltip);

  return wrapper;
};

const updateProcessTitle = (element, tag, shouldAdd) => {
  const titleInput = element.querySelector(CONFIG.SELECTORS.PROCESS_TITLE);
  const titleValue = titleInput.value;

  if (shouldAdd) {
    titleInput.value = `${titleValue.replace(tag, '')} ${tag}`.trim();
  } else {
    titleInput.value = titleValue.replace(tag, '').trim();
  }
};

const handleCheckboxChange = (currentCheckbox, otherCheckbox, titleElement, tag) => {
  if (currentCheckbox.checked && otherCheckbox.checked) {
    currentCheckbox.checked = false;
    alert(MESSAGES.CONFLICT);
    return;
  }

  updateProcessTitle(titleElement, tag, currentCheckbox.checked);
};

const validateExistingTags = (element) => {
  const titleValue = element.querySelector(CONFIG.SELECTORS.PROCESS_TITLE).value;
  const hasTech = titleValue.includes(CONFIG.TAGS.TECH);
  const hasOP = titleValue.includes(CONFIG.TAGS.OP);

  if (hasTech && hasOP) {
    alert(MESSAGES.TAG_CONFLICT);
  }
};

const initTitleObserver = (element, techCheckbox, opCheckbox) => {
  const titleInput = element.querySelector(CONFIG.SELECTORS.PROCESS_TITLE);

  titleInput.addEventListener('input', () => {
    validateExistingTags(element);
    techCheckbox.checked = titleInput.value.includes(CONFIG.TAGS.TECH);
    opCheckbox.checked = titleInput.value.includes(CONFIG.TAGS.OP);
  });
};

const createCheckboxEventListeners = (techCheckbox, opCheckbox, processTitleElement) => {
  techCheckbox.addEventListener('change', () => {
    handleCheckboxChange(techCheckbox, opCheckbox, processTitleElement, CONFIG.TAGS.TECH);
  });

  opCheckbox.addEventListener('change', () => {
    handleCheckboxChange(opCheckbox, techCheckbox, processTitleElement, CONFIG.TAGS.OP);
  });
};

const getInitialCheckboxStates = (processTitle) => ({
  techChecked: processTitle.includes(CONFIG.TAGS.TECH),
  opChecked: processTitle.includes(CONFIG.TAGS.OP),
});

const initializeSettings = (processTitleElement, settingsContainer) => {
  const techProcessSetting = createSettingWithTooltip(
    'recode-is-tech-process',
    'Это технический процесс',
    CONFIG.TOOLTIPS.TECH
  );
  const opProcessSetting = createSettingWithTooltip('recode-is-op-process', 'Это процесс для ОП', CONFIG.TOOLTIPS.OP);

  const techCheckbox = techProcessSetting.querySelector('input');
  const opCheckbox = opProcessSetting.querySelector('input');

  const processTitleInput = processTitleElement.querySelector(CONFIG.SELECTORS.PROCESS_TITLE);
  const processTitle = processTitleInput.value;
  const { techChecked, opChecked } = getInitialCheckboxStates(processTitle);

  techCheckbox.checked = techChecked;
  opCheckbox.checked = opChecked;

  validateExistingTags(processTitleElement);
  initTitleObserver(processTitleElement, techCheckbox, opCheckbox);
  createCheckboxEventListeners(techCheckbox, opCheckbox, processTitleElement);

  settingsContainer.appendChild(techProcessSetting);
  settingsContainer.appendChild(opProcessSetting);
};

const init = () => {
  if (!CONFIG.PATHNAME_PAGE.includes(currentUrl.pathname)) {
    return;
  }

  const processTitleElement = document.querySelector(CONFIG.SELECTORS.PROCESS_TITLE_ELEMENT);
  if (!processTitleElement) {
    return;
  }

  const settingsContainer = createSettingsContainer();
  initializeSettings(processTitleElement, settingsContainer);
  processTitleElement.after(settingsContainer);
};

export default init;
