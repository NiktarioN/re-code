/* eslint-disable no-param-reassign */

import { CSS_PREFIX } from '../../../config/constants';
import { FORM_FILTERS } from './forms-filters';
import { toPascalCase } from '../../../../../../utils/string-utils';

class FormEnhancementManager {
  constructor() {
    this.observers = new WeakMap();
    this.enhancements = new Map();
    this.formFilters = FORM_FILTERS;
  }

  registerEnhancement(name, enhancement) {
    console.log(`Регистрируем улучшение: ${name}`, enhancement);
    this.enhancements.set(name, {
      selector: enhancement.selector,
      handler: enhancement.handler,
      runOnce: enhancement.runOnce,
      debounceMs: enhancement.debounceMs,
      formFilter: enhancement.formFilter,
    });
  }

  unregisterEnhancement(name) {
    this.enhancements.delete(name);
  }

  init(forms) {
    console.log(`Зарегистрированные улучшения:`, Array.from(this.enhancements.keys()));

    forms.forEach((form) => {
      this.enhanceForm(form);
      this.observeForm(form);
    });
  }

  shouldSkipForm(enhancement, form) {
    if (!enhancement.formFilter) {
      return false;
    }

    const filterFunction = this.formFilters[enhancement.formFilter];
    return filterFunction ? !filterFunction(form) : false;
  }

  callWithDebounce(enhancement, element, form) {
    if (!this.debounceTimers) {
      this.debounceTimers = new WeakMap();
    }

    clearTimeout(this.debounceTimers.get(element));

    this.debounceTimers.set(
      element,
      setTimeout(() => {
        enhancement.handler(element, form);
        this.debounceTimers.delete(element);
      }, enhancement.debounceMs)
    );
  }

  enhanceForm(form) {
    this.enhancements.forEach((enhancement, name) => {
      console.log(`Проверяем улучшение: ${name}`);

      if (this.shouldSkipForm(enhancement, form)) {
        console.log(`❌ ${name}: форма не прошла фильтр`);
        return;
      }

      const elements = form.querySelectorAll(enhancement.selector);
      elements.forEach((element) => {
        const datasetKey = `${CSS_PREFIX}${toPascalCase(name)}`;

        if (enhancement.runOnce && element.dataset[datasetKey]) {
          return;
        }

        if (enhancement.debounceMs) {
          this.callWithDebounce(enhancement, element, form, name);
        } else {
          enhancement.handler(element, form);
        }

        if (enhancement.runOnce) {
          element.dataset[datasetKey] = 'true';
        }
      });
    });
  }

  observeForm(form) {
    if (this.observers.has(form)) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const hasNewElements = mutations.some((mutation) => mutation.type === 'childList' && mutation.addedNodes.length);

      if (hasNewElements) {
        this.enhanceForm(form);
      }
    });

    observer.observe(form, { childList: true, subtree: true });
    this.observers.set(form, observer);
  }

  unobserveForm(form) {
    const observer = this.observers.get(form);
    if (observer) {
      observer.disconnect();
      this.observers.delete(form);
    }
  }
}

const TASKS_ENHANCEMENTS_MANAGER = new FormEnhancementManager();

export default TASKS_ENHANCEMENTS_MANAGER;