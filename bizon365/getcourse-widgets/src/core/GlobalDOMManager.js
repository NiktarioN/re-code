import { CONFIG } from './config';

import { error, warn } from '../utils/logger';
import { injectWidgetStyles } from '../utils/stylesManager';

export default class GlobalDOMManager {
  static instance = null;

  static CONFIG = {
    TARGET_ELEMENTS: [CONFIG.BANNER_CONTAINER_SELECTOR, CONFIG.FILES_CONTAINER_SELECTOR],
    OBSERVERS_CONFIG: {
      CONTAINERS: CONFIG.OBSERVERS_CONFIG.CONTAINERS,
      ATTRIBUTES: CONFIG.OBSERVERS_CONFIG.ATTRIBUTES,
      CHILDLIST: CONFIG.OBSERVERS_CONFIG.CHILDLIST,
    },
    MUTATION_DEBOUNCE_DELAY: CONFIG.MUTATION_DEBOUNCE_DELAY,
    CONTAINER_VISIBILITY_DEBOUNCE: CONFIG.CONTAINER_VISIBILITY_DEBOUNCE,
  };

  constructor() {
    if (GlobalDOMManager.instance) {
      throw new Error('Используйте GlobalDOMManager.getInstance() вместо new GlobalDOMManager()');
    }

    this.activeWidgets = new Set();
    this.selectorRegistry = new Map();

    this.observers = new Map();
    this.containerObservers = new Map();
    this.isObserving = false;

    this.triggerMutationTimeout = null;
    this.attributeChangeTimeout = null;
    this.containerMutationsTimeouts = new Map();

    GlobalDOMManager.instance = this;
  }

  static getInstance() {
    if (!GlobalDOMManager.instance) {
      GlobalDOMManager.instance = new GlobalDOMManager();
    }

    return GlobalDOMManager.instance;
  }

  registerWidget(widget) {
    const validationErrors = this.validateWidget(widget);

    if (validationErrors.length > 0) {
      error('Ошибка регистрации виджета:', validationErrors);
      return false;
    }

    this.checkSelectorConflicts(widget);

    this.activeWidgets.add(widget);
    this.selectorRegistry.set(widget.config.ACTION_ELEMENT_SELECTOR, widget);

    this.evaluateObserverNeed();

    return true;
  }

  unregisterWidget(widget) {
    this.activeWidgets.delete(widget);

    if (widget.config?.ACTION_ELEMENT_SELECTOR) {
      this.selectorRegistry.delete(widget.config.ACTION_ELEMENT_SELECTOR);
    }

    this.evaluateObserverNeed();
  }

  destroyAllWidgets() {
    this.activeWidgets.forEach((widget) => {
      widget.destroy();
    });

    this.activeWidgets.clear();
    this.selectorRegistry.clear();
    this.clearAllTimeouts();
  }

  checkSelectorConflicts(widget) {
    const selector = widget.config.ACTION_ELEMENT_SELECTOR;
    const existingWidget = this.selectorRegistry.get(selector);

    if (existingWidget) {
      warn(
        `⚠️ Конфликт селекторов: "${selector}" уже используется другим виджетом.`,
        `Предыдущий виджет будет заменен новым.`,
        'Рекомендуется использовать уникальные селекторы для каждого виджета.'
      );

      this.activeWidgets.delete(existingWidget);
      existingWidget.destroy();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  validateWidget(widget) {
    if (!widget?.config?.ACTION_ELEMENT_SELECTOR) {
      return ['Отсутствует ACTION_ELEMENT_SELECTOR в конфиге виджета'];
    }

    const selector = widget.config.ACTION_ELEMENT_SELECTOR;
    if (typeof selector !== 'string' || !selector.length) {
      return ['ACTION_ELEMENT_SELECTOR должен быть непустой строкой'];
    }

    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  injectWidgetStyles() {
    injectWidgetStyles();
  }

  evaluateObserverNeed() {
    const shouldObserve = this.activeWidgets.size > 0;

    if (shouldObserve && !this.isObserving) {
      this.startGlobalObserver();
      return;
    }

    if (!shouldObserve && this.isObserving) {
      this.stopGlobalObserver();
    }
  }

  startGlobalObserver() {
    if (this.isObserving) {
      return;
    }

    this.injectWidgetStyles();

    GlobalDOMManager.CONFIG.TARGET_ELEMENTS.forEach((selector) => {
      this.setupObserversForElement(selector);
    });

    this.isObserving = true;
  }

  stopGlobalObserver() {
    if (!this.isObserving) {
      return;
    }

    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();

    this.containerObservers.forEach((observer) => {
      observer.disconnect();
    });
    this.containerObservers.clear();

    this.isObserving = false;
    this.clearAllTimeouts();
  }

  setupObserversForElement(selector) {
    const targetElement = document.querySelector(selector);

    if (!targetElement) {
      return;
    }

    this.createTriggerObserver(targetElement, selector);

    if (selector === CONFIG.BANNER_CONTAINER_SELECTOR) {
      this.createContainerObserver(targetElement, selector);
    }
  }

  createTriggerObserver(targetElement, selector) {
    const observerConfig = this.getObserverConfig(selector);

    const triggerObserver = new MutationObserver((mutations) => {
      this.handleTriggerMutations(mutations);
    });

    triggerObserver.observe(targetElement, observerConfig);
    this.observers.set(selector, triggerObserver);
  }

  // eslint-disable-next-line class-methods-use-this
  getObserverConfig(selector) {
    if (selector === CONFIG.BANNER_CONTAINER_SELECTOR) {
      return GlobalDOMManager.CONFIG.OBSERVERS_CONFIG.ATTRIBUTES;
    }

    if (selector === CONFIG.FILES_CONTAINER_SELECTOR) {
      return GlobalDOMManager.CONFIG.OBSERVERS_CONFIG.CHILDLIST;
    }

    return GlobalDOMManager.CONFIG.OBSERVERS_CONFIG.CHILDLIST;
  }

  createContainerObserver(targetElement, selector) {
    const containerObserver = new MutationObserver((mutations) => {
      this.handleContainerMutations(mutations, selector);
    });

    containerObserver.observe(targetElement, GlobalDOMManager.CONFIG.OBSERVERS_CONFIG.CONTAINERS);
    this.containerObservers.set(selector, containerObserver);
  }

  handleTriggerMutations(mutations) {
    const relevantMutations = this.filterRelevantMutations(mutations);

    if (relevantMutations.length === 0) {
      return;
    }

    const attributeMutations = relevantMutations.filter((mutation) => mutation.type === 'attributes');
    const childListMutations = relevantMutations.filter((mutation) => mutation.type === 'childList');

    if (attributeMutations.length > 0) {
      this.scheduleDebouncedAttributeChange(attributeMutations);
    }

    if (childListMutations.length > 0) {
      this.scheduleDebouncedDOMUpdate();
    }
  }

  scheduleDebouncedAttributeChange(mutations) {
    if (this.attributeChangeTimeout) {
      clearTimeout(this.attributeChangeTimeout);
    }

    this.attributeChangeTimeout = setTimeout(() => {
      mutations.forEach((mutation) => {
        this.notifyWidgetsAboutAttributeChange(mutation.target);
      });
      this.attributeChangeTimeout = null;
    }, GlobalDOMManager.CONFIG.MUTATION_DEBOUNCE_DELAY);
  }

  scheduleDebouncedDOMUpdate() {
    if (this.triggerMutationTimeout) {
      clearTimeout(this.triggerMutationTimeout);
    }

    this.triggerMutationTimeout = setTimeout(() => {
      this.processDOMUpdates();
      this.triggerMutationTimeout = null;
    }, GlobalDOMManager.CONFIG.MUTATION_DEBOUNCE_DELAY);
  }

  handleContainerMutations(mutations, containerSelector) {
    const existingTimeout = this.containerMutationsTimeouts.get(containerSelector);

    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeoutId = setTimeout(() => {
      this.updateContainerVisibility(containerSelector);
      this.containerMutationsTimeouts.delete(containerSelector);
    }, GlobalDOMManager.CONFIG.CONTAINER_VISIBILITY_DEBOUNCE);

    this.containerMutationsTimeouts.set(containerSelector, timeoutId);
  }

  updateContainerVisibility(containerSelector) {
    const container = document.querySelector(containerSelector);
    const isVisible = this.isContainerVisible(container);

    if (!isVisible) {
      this.removeWidgetsInContainer(containerSelector);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isContainerVisible(container) {
    if (!container) {
      return false;
    }

    const containerStyles = window.getComputedStyle(container);

    return containerStyles.display !== 'none';
  }

  removeWidgetsInContainer(containerSelector) {
    const container = document.querySelector(containerSelector);

    if (!container) {
      return;
    }

    this.activeWidgets.forEach((widget) => {
      const elements = container.querySelectorAll(widget.config.ACTION_ELEMENT_SELECTOR);

      elements.forEach((element) => {
        const elementId = element.dataset.recodeWidgetId;
        console.log('🔵 removeWidgetsInContainer:', elementId);

        if (elementId && widget.managedElements.has(elementId)) {
          widget.removeWidgetContainer(elementId);
          widget.cleanupElementAttributes(element);
        }
      });
    });
  }

  processDOMUpdates() {
    this.activeWidgets.forEach((widget) => {
      widget.onDOMUpdate();
    });
  }

  notifyWidgetsAboutAttributeChange(target) {
    console.log('🔔 notifyWidgetsAboutAttributeChange for element:', target);
    console.log('🔔 activeWidgets count:', this.activeWidgets.size);

    this.activeWidgets.forEach((widget, index) => {
      const isRelevantWidget = this.isTargetRelevantForWidget(target, widget);

      console.log(`🔔 Widget ${index}:`, isRelevantWidget ? 'RELEVANT' : 'SKIP');

      if (isRelevantWidget) {
        console.log(`🔔 Before processing, element classes:`, Array.from(target.classList));
        widget.onAttributeChange(target);
        console.log(`🔔 After processing, element classes:`, Array.from(target.classList));
      }
    });
  }

  filterRelevantMutations(mutations) {
    return mutations.filter((mutation) => {
      if (mutation.type === 'attributes') {
        return this.isRelevantAttributeChange(mutation.target);
      }

      if (mutation.type === 'childList') {
        return this.hasRelevantChildListChanges(mutation);
      }

      return false;
    });
  }

  isRelevantAttributeChange(target) {
    return Array.from(this.activeWidgets).some((widget) => this.isTargetRelevantForWidget(target, widget));
  }

  hasRelevantChildListChanges(mutation) {
    const checkNodes = (nodes) =>
      Array.from(nodes).some((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return false;
        }

        return Array.from(this.activeWidgets).some(
          (widget) =>
            node.matches?.(widget.config.ACTION_ELEMENT_SELECTOR) ||
            node.querySelector?.(widget.config.ACTION_ELEMENT_SELECTOR)
        );
      });

    return checkNodes(mutation.addedNodes) || checkNodes(mutation.removedNodes);
  }

  // eslint-disable-next-line class-methods-use-this
  isTargetRelevantForWidget(target, widget) {
    const matchesSelector = target.matches?.(widget.config.ACTION_ELEMENT_SELECTOR);
    const isOwnedByWidget = widget.isElementOwnedByWidget(target);

    return matchesSelector || isOwnedByWidget;
  }

  clearAllTimeouts() {
    if (this.triggerMutationTimeout) {
      clearTimeout(this.triggerMutationTimeout);
      this.triggerMutationTimeout = null;
    }

    if (this.attributeChangeTimeout) {
      clearTimeout(this.attributeChangeTimeout);
      this.attributeChangeTimeout = null;
    }

    this.containerMutationsTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.containerMutationsTimeouts.clear();
  }
}
