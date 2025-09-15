
import BaseWidgetManager from '../core/BaseWidgetManager';
import { createTabNavigation, createTabContent } from '../ui/tabs';
import { updateIframeHeight } from '../utils/iframeHelpers';
import { generateRandomId } from '../utils/idHelpers';

export default class TabWidgetManager extends BaseWidgetManager {
  constructor(config) {
    super();

    this.config = {
      ACTION_ELEMENT_SELECTOR: config.actionElementSelector,
      TABS_CONFIG: this.processTabsConfig(config.tabs),
    };

    this.activeTabIndex = 0;
    this.tabContainer = null;
    this.isWidgetJustOpened = false;
  }

  validateConfig() {
    const errors = [];

    if (!this.config?.ACTION_ELEMENT_SELECTOR) {
      errors.push('ACTION_ELEMENT_SELECTOR должен быть строкой');
    }

    if (!Array.isArray(this.config?.TABS_CONFIG)) {
      errors.push('TABS_CONFIG должен быть массивом');
      return errors;
    }

    if (this.config.TABS_CONFIG.length === 0) {
      errors.push('TABS_CONFIG не может быть пустым');
      return errors;
    }

    this.config.TABS_CONFIG.forEach((tab, index) => {
      if (!tab.widgetId || !tab.widgetSrc) {
        errors.push(`Таб ${index}: отсутствует widgetId или widgetSrc`);
      }
    });

    return errors;
  }

  createWidget(element) {
    const container = this.getOrCreateWidgetContainer(element);

    if (!container) {
      return false;
    }

    this.tabContainer = container;
    this.buildTabInterface();

    return true;
  }

  buildTabInterface() {
    const navigation = createTabNavigation(this.config.TABS_CONFIG);
    const contentContainer = createTabContent(this.config.TABS_CONFIG);

    this.tabContainer.appendChild(navigation);
    this.tabContainer.appendChild(contentContainer);

    this.setupTabEventHandlers();
    this.initializeAllTabs();
    this.activateTab(0);
  }

  setupTabEventHandlers() {
    const tabLinks = this.tabContainer.querySelectorAll('a[data-toggle="tab"]');

    tabLinks.forEach((tabLink, index) => {
      tabLink.addEventListener('click', (event) => {
        event.preventDefault();
        this.switchToTab(index);
      });
    });
  }

  initializeAllTabs() {
    this.config.TABS_CONFIG.forEach((tabConfig) => {
      const tabPane = this.tabContainer.querySelector(`#${tabConfig.id}`);

      if (!tabPane) {
        return;
      }

      const iframe = this.createIframe(tabConfig.widgetId, tabConfig.widgetSrc);
      tabPane.appendChild(iframe);

      this.setupTabMessageHandler(iframe.id, tabPane, tabConfig.widgetId);
    });
  }

  setupTabMessageHandler(iframeId, container, widgetId) {
    const handler = (event) => this.handleIframeMessage(event, iframeId, container, widgetId);
    this.messageHandlers.set(iframeId, handler);
    window.addEventListener('message', handler);
  }

  handleIframeMessage(event, iframeId, containerElement, widgetId) {
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

    const shouldScroll = this.isWidgetJustOpened && this.shouldScrollOnNextHeightChange;
    updateIframeHeight(containerElement, iframe, height, shouldScroll, this.tabContainer, 20);

    if (shouldScroll) {
      this.shouldScrollOnNextHeightChange = false;
      this.isWidgetJustOpened = false;
    }
  }

  switchToTab(tabIndex) {
    if (tabIndex === this.activeTabIndex) {
      return;
    }

    this.deactivateCurrentTab();
    this.activateTab(tabIndex);
    this.activeTabIndex = tabIndex;
  }

  deactivateCurrentTab() {
    const currentTabLink = this.tabContainer.querySelector('li.active');
    const currentTabPane = this.tabContainer.querySelector('.tab-pane.active');

    currentTabLink?.classList.remove('active');
    currentTabPane?.classList.remove('active');
  }

  activateTab(tabIndex) {
    const tabLinks = this.tabContainer.querySelectorAll('li[role="presentation"]');
    const tabPanes = this.tabContainer.querySelectorAll('.tab-pane');

    tabLinks[tabIndex]?.classList.add('active');
    tabPanes[tabIndex]?.classList.add('active');
  }

  handleClick = (event) => {
    event.preventDefault();
    this.isWidgetJustOpened = true;
    this.shouldScrollOnNextHeightChange = true;
  };

  // eslint-disable-next-line class-methods-use-this
  processTabsConfig(tabs) {
    if (!Array.isArray(tabs)) {
      return [];
    }

    return tabs.map((tab) => ({
      id: `tab-${generateRandomId()}`,
      title: tab.title || 'Без названия',
      widgetId: tab.widgetId,
      widgetSrc: tab.widgetSrc,
    }));
  }

  destroy() {
    super.destroy();
    this.tabContainer = null;
    this.isWidgetJustOpened = false;
    this.activeTabIndex = 0;
  }
}
