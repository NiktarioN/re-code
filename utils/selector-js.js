/**
 * SelectorJS - Минималистичная библиотека для работы с элементами select
 */

export class SelectorJS {
  constructor(selector) {
    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;

    if (!this.element) {
      throw new Error(`Элемент с селектором "${selector}" не найден`);
    }

    if (this.element.tagName !== 'SELECT') {
      throw new Error(`Ожидается SELECT элемент, получен ${this.element.tagName}`);
    }
  }

  /**
   * Получить установленное значение в поле
   * @returns {string} Значение выбранной опции
   */
  get value() {
    return this.element.value;
  }

  /**
   * Установить значение select с валидацией
   * @param {string} newValue - Новое значение
   */
  set value(newValue) {
    const stringValue = newValue.toString();
    const option = Array.from(this.element.options).find(opt => opt.value === stringValue);
    if (!option) {
      throw new Error(`Опция со значением "${newValue}" не найдена`);
    }

    this.element.value = stringValue;
    this.#triggerChange();
  }

  /**
   * Установить значение через индекс опции
   * @param {number} index - Индекс опции (начиная с 0)
   * @returns {SelectorJS} Возвращает this для цепочки вызовов
   */
  setValueByIndex(index) {
    this.selectedIndex = index;
    return this;
  }

  /**
   * Установить значение через текст опции
   * @param {string} text - Текст опции для поиска
   * @returns {SelectorJS} Возвращает this для цепочки вызовов
   */
  setValueByText(text) {
    if (typeof text !== 'string') {
      throw new Error('Текст должен быть строкой');
    }

    const option = Array.from(this.element.options).find(opt => opt.textContent === text);
    if (!option) {
      throw new Error(`Опция с текстом "${text}" не найдена`);
    }

    this.value = option.value;
    return this;
  }

  /**
   * Получить текст выбранной опции
   * @returns {string} Текст выбранной опции или пустая строка
   */
  get selectedText() {
    const selectedOption = this.element.options[this.element.selectedIndex];
    return selectedOption ? selectedOption.textContent : '';
  }

  /**
   * Получить индекс выбранной опции
   * @returns {number} Индекс выбранной опции
   */
  get selectedIndex() {
    return this.element.selectedIndex;
  }

  /**
   * Установить опцию по индексу с валидацией
   * @param {number} index - Индекс опции
   */
  set selectedIndex(index) {
    if (typeof index !== 'number' || index < 0) {
      throw new Error('Индекс должен быть положительным числом');
    }

    if (index >= this.element.options.length) {
      throw new Error(`Опция с индексом ${index} не найдена. Всего опций: ${this.element.options.length}`);
    }

    this.element.selectedIndex = index;
    this.#triggerChange();
  }

  /**
   * Проверить, выбрана ли опция (не пустое значение)
   * @returns {boolean} true если опция выбрана и значение не пустое
   */
  get hasSelection() {
    return this.element.value !== '' && this.element.selectedIndex !== -1;
  }

  /**
   * Получить все опции как массив объектов
   * @returns {Array} Массив объектов с данными опций
   */
  get allOptions() {
    return Array.from(this.element.options).map((option, index) => ({
      value: option.value,
      text: option.textContent,
      selected: option.selected,
      index: index
    }));
  }

  /**
   * Сбросить выбор к первой опции
   * @returns {SelectorJS} Возвращает this для цепочки вызовов
   */
  reset() {
    this.selectedIndex = 0;
    return this;
  }

  /**
   * Добавить обработчик события изменения
   * @param {Function} callback - Функция обработчик
   * @returns {SelectorJS} Возвращает this для цепочки вызовов
   */
  onChange(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Обработчик должен быть функцией');
    }

    this.element.addEventListener('change', (event) => {
      callback({
        value: this.value,
        text: this.selectedText,
        index: this.selectedIndex,
        element: this.element,
        originalEvent: event
      });
    });

    return this;
  }

  /**
   * Приватный метод для инициирования события change
   * @private
   */
  #triggerChange() {
    const changeEvent = new Event('change', {
      bubbles: true,
      cancelable: true
    });
    this.element.dispatchEvent(changeEvent);
  }
}