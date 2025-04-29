/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

const CONSTANTS = {
  HINT_TEXT:
    '[RE-CODE] Для добавления даты записи в комментариях просто нажмите ENTER или клик по пустому полю. Если дата не нужна, то нажмите SHIFT + ENTER',
  HINT_STYLES: `
    display: inline-block;
    margin-bottom: 5px;
    font-family: "proxima-nova", "Lato", Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 400;
    font-style: italic;
    color: #666;
  `,
  PROCESSED_ATTR: 'recode-processed-field',
  FORM_SELECTOR: '.task-form',
  MESSAGE_FIELD_FOUND: 'RECODE AGENCY. Найден блок с комментарием, запускаем обработчики для него...'
};

const getMoscowDate = () => {
  const currentDate = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return currentDate.replace(',', '');
};

const createHint = () => {
  const span = document.createElement('span');
  span.textContent = CONSTANTS.HINT_TEXT;
  span.style.cssText = CONSTANTS.HINT_STYLES;

  return span;
};

const handleClick = (field) => {
  if (!field.value.trim()) {
    const dateString = `${getMoscowDate()} — `;
    field.value = dateString;
    field.setSelectionRange(dateString.length, dateString.length);
  }
};

const handleKeyDown = (event, field) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();

    const cursorPosition = field.selectionStart;
    const textBefore = field.value.substring(0, cursorPosition);
    const textAfter = field.value.substring(cursorPosition);
    const dateString = `${getMoscowDate()} — `;

    field.value = `${textBefore}\n${dateString}${textAfter}`;

    const newCursorPosition = cursorPosition + dateString.length + 1;
    field.setSelectionRange(newCursorPosition, newCursorPosition);
  }
};

const attachFieldHandlers = (field) => {
  if (field.hasAttribute(CONSTANTS.PROCESSED_ATTR)) {
    return;
  }

  console.log(CONSTANTS.MESSAGE_FIELD_FOUND);

  const hint = createHint();
  field.before(hint);
  field.setAttribute(CONSTANTS.PROCESSED_ATTR, 'true');

  field.addEventListener('click', () => handleClick(field));
  field.addEventListener('keydown', (event) => handleKeyDown(event, field));
};

const observeForms = (commentsFieldId) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'childList' &&
        mutation.addedNodes.length &&
        mutation.target.closest &&
        mutation.target.closest(CONSTANTS.FORM_SELECTOR)
      ) {
        const field = mutation.target.querySelector(
          `[id="field-input-${commentsFieldId}"]`
        );
        if (field) {
          attachFieldHandlers(field);
        }
      }
    });
  });

  return observer;
};

const app = (commentsFieldId) => {
  if (!commentsFieldId) {
    return;
  }

  const forms = document.querySelectorAll(CONSTANTS.FORM_SELECTOR);
  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    const field = form.querySelector(`[id="field-input-${commentsFieldId}"]`);
    if (field) {
      attachFieldHandlers(field);
    }
  });

  const observer = observeForms(commentsFieldId);
  forms.forEach((form) => {
    observer.observe(form, {
      childList: true,
      subtree: true,
    });
  });

  window.addEventListener('unload', () => observer.disconnect());
};

export default app;