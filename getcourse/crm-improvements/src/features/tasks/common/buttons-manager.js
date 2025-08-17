import { CLASSES } from '../../../config/constants';

class TaskButtonsManager {
  static SELECTORS = {
    SUBMIT_BUTTONS: 'button[type="submit"]',
    RESULTS_BLOCK: '.results-block',
    SUCCESS_BUTTON: 'button[data-result-id="success"]',
  };

  static BACK_BUTTON_TEXTS = ['назад', 'вернуться', '◀️', '⬅️', '←'];

  static ATTRIBUTES = {
    SUCCESS_RESULT_ID: 'success',
  };

  constructor(form) {
    this.form = form;
  }

  getAllButtons() {
    return [...this.form.querySelectorAll(`${this.constructor.SELECTORS.RESULTS_BLOCK} button`)];
  }

  getSubmitButtons() {
    return this.getAllButtons().filter((button) => button.type === 'submit');
  }

  getResultButtons() {
    return this.getAllButtons().filter((button) => button.dataset.resultId === this.constructor.ATTRIBUTES.SUCCESS_RESULT_ID);
  }

  getBackButtons() {
    return this.getAllButtons().filter((button) => TaskButtonsManager.isBackButton(button));
  }

  getAllExceptBackButtons() {
    return this.getAllButtons().filter((button) => !TaskButtonsManager.isBackButton(button));
  }

  getButtonsByResultId(resultId) {
    return this.getAllButtons().filter((button) => button.dataset.resultId === resultId);
  }

  getButtonsByText(searchText) {
    const normalizedSearchText = searchText.toLowerCase().trim();
    return this.getAllButtons().filter((button) =>
      button.textContent.toLowerCase().trim().includes(normalizedSearchText)
    );
  }

  getResultsBlock() {
    return this.form.querySelector(this.constructor.SELECTORS.RESULTS_BLOCK);
  }

  getSuccessButtonSelector() {
    return this.constructor.SELECTORS.SUCCESS_BUTTON;
  }

  getSuccessResultId() {
    return this.constructor.ATTRIBUTES.SUCCESS_RESULT_ID;
  }

  static isBackButton(button) {
    const buttonText = button.textContent.toLowerCase().trim();
    return this.BACK_BUTTON_TEXTS.some((backText) => buttonText.includes(backText));
  }

  static blockButtons(buttons, shouldBlock) {
    buttons.forEach((btn) => btn.classList.toggle(CLASSES.DISABLED, shouldBlock));
  }
}

export default TaskButtonsManager;