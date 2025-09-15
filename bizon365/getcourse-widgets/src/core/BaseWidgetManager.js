import { CONFIG } from './config';

import GlobalDOMManager from './GlobalDOMManager';
import { generateRandomIframeClass, updateIframeHeight } from '../utils/iframeHelpers';
import { generateRandomId } from '../utils/idHelpers';

export default class BaseWidgetManager {
  constructor() {
    this.globalDOMManager = GlobalDOMManager.getInstance();
    this.isInitialized = false;

    this.shouldScrollOnNextHeightChange = false;

    this.iframeClass = generateRandomIframeClass();
    this.widgetInstanceId = generateRandomId();

    this.managedElements = new Map();
    this.messageHandlers = new Map();
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    const validationErrors = this.validateConfig();

    if (validationErrors.length > 0) {
      throw new Error(`Неверная конфигурация виджета: ${validationErrors.join(', ')}`);
    }

    if (!this.globalDOMManager.registerWidget(this)) {
      throw new Error('Не удалось зарегистрировать виджет');
    }

    this.isInitialized = true;
  }

  // eslint-disable-next-line class-methods-use-this
  validateConfig() {
    if (!this.config) {
      return ['Отсутствует конфиг'];
    }

    const errors = CONFIG.REQUIRED_FIELDS.filter((field) => {
      const value = this.config[field];
      return typeof value !== 'string' || !value.length;
    }).map((field) => `${field} должен быть непустой строкой`);

    return errors;
  }

  // eslint-disable-next-line class-methods-use-this
  createWidget() {
    throw new Error('createWidget нужно обязателено переопределить в дочернем классе');
  }

  onDOMUpdate() {
    this.processNewElements();
    this.cleanupRemovedElements();
  }

  onAttributeChange(element) {
    const matchesSelector = element.matches(this.config.ACTION_ELEMENT_SELECTOR);
    const isOwnedByThisWidget = this.isElementOwnedByWidget(element);

    console.log('🔵 onAttributeChange matches/owned:', matchesSelector, isOwnedByThisWidget);

    if (!matchesSelector && !isOwnedByThisWidget) {
      console.log('🔵 onAttributeChange will ignore:', element);
      return;
    }

    if (matchesSelector && !isOwnedByThisWidget) {
      console.log('🔵 onAttributeChange will process new:', element);
      this.processElements([element]);
      return;
    }

    if (!matchesSelector && isOwnedByThisWidget) {
      console.log('🔵 onAttributeChange will cleanup:', element);
      this.cleanupElement(element);
      return;
    }

    if (matchesSelector && isOwnedByThisWidget) {
      console.log('🔵 onAttributeChange will recreate:', element);
      this.setupActionElement(element);
      this.createWidget(element);
    }
  }

  isElementOwnedByWidget(element) {
    const elementId = element?.dataset?.recodeWidgetId;

    if (!elementId) {
      return false;
    }

    return elementId.endsWith(this.widgetInstanceId);
  }

  cleanupRemovedElements() {
    const currentElements = document.querySelectorAll(this.config.ACTION_ELEMENT_SELECTOR);
    const currentElementIds = new Set();

    console.log('🔵 cleanupRemovedElements', currentElements);

    currentElements.forEach((element) => {
      const elementId = element.dataset.recodeWidgetId;

      if (elementId && this.isElementOwnedByWidget(element)) {
        console.log('🔵 cleanupRemovedElements will keep:', elementId);
        currentElementIds.add(elementId);
      }
    });

    this.managedElements.forEach((managedElement, elementId) => {
      if (!currentElementIds.has(elementId)) {
        console.log('🔵 cleanupRemovedElements will remove:', elementId);
        this.removeWidgetContainer(elementId);
      }
    });
  }

  cleanupElement(element) {
    const elementId = element.dataset.recodeWidgetId;

    if (elementId) {
      this.removeWidgetContainer(elementId);
    }

    this.cleanupElementAttributes(element);
  }

  cleanupElementAttributes(element) {
    element.classList.remove(CONFIG.WIDGET_TRIGGER_CLASS, 'hide');

    element.removeEventListener('click', this.handleClick);
    element.removeAttribute('data-recode-widget-id');
    element.removeAttribute('data-toggle');
    element.removeAttribute('data-target');
  }

  processNewElements() {
    const elements = document.querySelectorAll(this.config.ACTION_ELEMENT_SELECTOR);
    const newElements = Array.from(elements).filter(
      (element) => !element.classList.contains(CONFIG.WIDGET_TRIGGER_CLASS)
    );

    this.processElements(newElements);
  }

  processElements(elements) {
    elements.forEach((element) => {
      this.setupActionElement(element);
      this.createWidget(element);
    });
  }

  getOrCreateWidgetContainer(element) {
    if (!element.parentElement) {
      return null;
    }

    const elementId = this.getOrCreateElementId(element);
    const existingManagedElement = this.managedElements.get(elementId);

    if (existingManagedElement?.container && document.contains(existingManagedElement.container)) {
      console.log('🟢 Reusing existing container:', elementId);
      return existingManagedElement.container;
    }

    if (existingManagedElement) {
      this.removeWidgetContainer(elementId);
    }

    return this.createNewWidgetContainer(element, elementId);
  }

  createNewWidgetContainer(element, elementId) {
    const container = this.createWidgetContainerElement(elementId);

    element.parentElement.after(container);

    this.managedElements.set(elementId, { element, container });
    console.log('🟢 Managed elements:', Array(this.managedElements));
    console.log('🟢 Created new container:', elementId);

    return container;
  }

  // eslint-disable-next-line class-methods-use-this
  createWidgetContainerElement(elementId) {
    const container = document.createElement('div');
    container.id = `${CONFIG.WIDGET_BASE_NAME}-${elementId}`;
    container.className = `collapse ${CONFIG.WIDGET_BASE_NAME}`;
    container.style.overflow = 'hidden';

    return container;
  }

  getOrCreateElementId(element) {
    const existingElementId = element.dataset.recodeWidgetId;

    if (existingElementId && this.isValidElementId(existingElementId)) {
      return existingElementId;
    }

    if (existingElementId) {
      this.removeWidgetContainer(existingElementId);
    }

    const newElementId = this.generateUniqueElementId(element);
    element.dataset.recodeWidgetId = newElementId;

    console.log('🔄 Generated new element ID:', newElementId);
    return newElementId;
  }

  isValidElementId(elementId) {
    return elementId.endsWith(this.widgetInstanceId);
  }

  generateUniqueElementId(element) {
    const href = element.getAttribute('href') || '';
    const text = element.textContent?.trim() || '';

    const contentData = `${href}-${text}`;
    const contentHash = this.generateContentHash(contentData);

    return `${contentHash}-${this.widgetInstanceId}`;
  }

  // eslint-disable-next-line class-methods-use-this
  generateContentHash(str) {
    const hash = Array.from(str).reduce((acc, char) => acc * 32 - acc + char.charCodeAt(0), 0);

    return Math.abs(hash).toString(36).slice(0, 8);
  }

  setupActionElement(element) {
    console.log('🟡 setupActionElement', element);

    element.classList.add(CONFIG.WIDGET_TRIGGER_CLASS);
    element.classList.remove('hide');
    element.removeAttribute('target');
    element.setAttribute('data-toggle', 'collapse');

    const elementId = this.getOrCreateElementId(element);
    const containerId = `${CONFIG.WIDGET_BASE_NAME}-${elementId}`;
    element.setAttribute('data-target', `#${containerId}`);

    element.addEventListener('click', this.handleClick);
  }

  removeWidgetContainer(elementId) {
    console.log('🟡 removeWidgetContainer', elementId);
    const managedElement = this.managedElements.get(elementId);

    if (managedElement?.container) {
      managedElement.container.remove();
    }

    const containerId = `${CONFIG.WIDGET_BASE_NAME}-${elementId}`;
    const domContainer = document.getElementById(containerId);
    if (domContainer) {
      domContainer.remove();
    }

    this.managedElements.delete(elementId);
    this.cleanupMessageHandlersForWidget(elementId);
  }

  cleanupMessageHandlersForWidget(elementId) {
    const handlersToRemove = Array.from(this.messageHandlers.entries()).filter(([iframeId]) =>
      iframeId.includes(elementId)
    );

    handlersToRemove.forEach(([iframeId, handler]) => {
      window.removeEventListener('message', handler);
      this.messageHandlers.delete(iframeId);
    });
  }

  createAndInsertIframe(container, widgetId = null, widgetSrc = null) {
    const iframe = this.createIframe(widgetId, widgetSrc);
    container.appendChild(iframe);
    this.setupMessageHandler(iframe.id, container, widgetId || this.config.WIDGET_ID);
  }

  createIframe(widgetId = null, widgetSrc = null) {
    const iframe = document.createElement('iframe');
    const actualWidgetId = widgetId || this.config.WIDGET_ID;
    const iframeId = `${actualWidgetId}_${this.iframeClass}`;

    iframe.src = this.buildIframeSrc(widgetSrc);
    iframe.style.cssText = `
      width: 100%;
      height: ${CONFIG.IFRAME_INITIAL_HEIGHT};
      border: none;
      overflow: hidden;
    `;
    iframe.setAttribute('allowfullscreen', 'allowfullscreen');
    iframe.className = this.iframeClass.toString();
    iframe.id = iframeId;
    iframe.name = this.iframeClass.toString();

    return iframe;
  }

  buildIframeSrc(widgetSrc = null) {
    const src = widgetSrc || this.config.WIDGET_SRC;
    const baseUrl = src.split('/pl/')[0];
    const widgetId = this.extractWidgetId(src);
    const searchParams = window.location.search.substring(1);
    const referrer = encodeURIComponent(document.referrer);
    const location = encodeURIComponent(document.location.href);

    return `${baseUrl}/pl/lite/widget/widget?${searchParams}&id=${widgetId}&ref=${referrer}&loc=${location}`;
  }

  // eslint-disable-next-line class-methods-use-this
  extractWidgetId(widgetSrc) {
    const urlParts = widgetSrc.split('?')[1];

    if (!urlParts) {
      return '';
    }

    const match = urlParts.match(/\d+/);

    return match ? match[0] : '';
  }

  setupMessageHandler(iframeId, container, widgetId) {
    const handler = (event) => this.handleIframeMessage(event, iframeId, container, widgetId);
    this.messageHandlers.set(iframeId, handler);
    window.addEventListener('message', handler);
  }

  handleIframeMessage(event, iframeId, container, widgetId) {
    const iframe = document.getElementById(iframeId);

    if (!iframe || !event.data) {
      return;
    }

    const { uniqName, height, iframeName } = event.data;

    if (uniqName !== widgetId || !height) {
      return;
    }

    if (iframeName && iframeName !== iframe.name) {
      return;
    }

    updateIframeHeight(container, iframe, height, this.shouldScrollOnNextHeightChange, null, 20);

    if (this.shouldScrollOnNextHeightChange) {
      this.shouldScrollOnNextHeightChange = false;
    }
  }

  handleClick = (event) => {
    event.preventDefault();
    this.shouldScrollOnNextHeightChange = true;
  };

  destroy() {
    this.globalDOMManager.unregisterWidget(this);
    this.isInitialized = false;

    this.managedElements.forEach((managedElement) => {
      if (managedElement.container) {
        managedElement.container.remove();
      }
    });
    this.managedElements.clear();

    this.messageHandlers.forEach((handler) => {
      window.removeEventListener('message', handler);
    });
    this.messageHandlers.clear();
  }
}
