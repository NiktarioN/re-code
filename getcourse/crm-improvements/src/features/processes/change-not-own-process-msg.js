import { PLUGIN_NAME, PROJECT_NAME_SHORT_ALT, PROJECT_LINK, CSS_PREFIX } from "../../config/constants";
import { isProcessEditorPage } from '../../../../utils/page-checker';
import { getProcessData } from '../../../../utils/gets';

const CONFIG = {
  FUNCTION_NAME: 'Редирект в шаблон процесса',
  SELECTORS: {
    TARGET_NODE: '.not-own-process-message',
    BUTTONS_TO_HIDE: '.mission-update > .standard-page-actions > .btn',
  },
  CLASS_NAMES: {
    MESSAGE_CONTAINER: `${CSS_PREFIX}-not-own-process-message`,
    HIDE: 'hide',
  },
  REGEX_PATTERN: /Используется шаблонный процесс\s*"([^"]*)"\./,
};

const MESSAGES = {
  ERROR: 'Произошла ошибка при обработке шаблонного процесса',
}

const renderTemplateMessage = (element, templateProcessName, processLink) => {
  element.innerHTML = `
    <p class="${CONFIG.CLASS_NAMES.MESSAGE_CONTAINER}__title">
      Используется шаблон от процесса <strong>"${templateProcessName}"</strong>
    </p>
    <p class="${CONFIG.CLASS_NAMES.MESSAGE_CONTAINER}__text">
      Нельзя изменять текущий процесс, который основан на шаблоне, т.к. придется дополнительно следить еще и за текущим
      процессом
    </p>
    <p class="${CONFIG.CLASS_NAMES.MESSAGE_CONTAINER}__text">
      Лучше всего редактировать шаблонный процесс, и тогда изменения применятся сразу во всех процессах, где этот
      шаблон был использован
    </p>
    <p class="${CONFIG.CLASS_NAMES.MESSAGE_CONTAINER}__text">
      Если же ты все таки хочешь изменить текущий процесс, то просто скопируй сам процесс с шаблоном, а не выбирай шаблон
      при создании процесса
    </p>
    <a
      class="${CONFIG.CLASS_NAMES.MESSAGE_CONTAINER}__button btn btn-success"
      href="${processLink}"
      rel="noopener noreferrer"
      >
      Перейти в шаблонный процесс
    </a>
    <a
      class="${CONFIG.CLASS_NAMES.RECODE_MESSAGE}__author"
      href="${PROJECT_LINK}"
      target="_blank"
      rel="noopener noreferrer"
    >
      Здесь были ребята из ${PROJECT_NAME_SHORT_ALT}
    </a>
  `;
};

const handleTemplateProcess = async (targetElement) => {
  try {
    targetElement.classList.add(CONFIG.CLASS_NAMES.RECODE_MESSAGE);
    document
      .querySelectorAll(CONFIG.SELECTORS.BUTTONS_TO_HIDE)
      .forEach((button) => button.classList.add(CONFIG.CLASS_NAMES.HIDE));

    const templateProcessName = targetElement.textContent.match(CONFIG.REGEX_PATTERN)?.[1];
    if (!templateProcessName) {
      return;
    }

    const { processLink } = await getProcessData(templateProcessName);

    if (processLink) {
      window.location.href = processLink;
      return;
    }

    renderTemplateMessage(targetElement, templateProcessName, processLink);
  } catch (error) {
    console.error(`${PLUGIN_NAME}. ${CONFIG.FUNCTION_NAME}. ${MESSAGES.ERROR}:`, error);
  }
};

const init = async () => {
  if (!isProcessEditorPage) {
    return;
  }

  const targetElement = document.querySelector(CONFIG.SELECTORS.TARGET_NODE);
  if (!targetElement) {
    return;
  }

  await handleTemplateProcess(targetElement)
}

export default init;
