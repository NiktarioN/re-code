import BaseWidgetManager from '../core/BaseWidgetManager';

export default class AutoWidgetManager extends BaseWidgetManager {
  constructor(config) {
    super();

    this.config = {
      WIDGET_ID: config.widgetId,
      WIDGET_SRC: config.widgetSrc,
      ACTION_ELEMENT_SELECTOR: config.actionElementSelector,
    };
  }

  createWidget(element) {
    const container = this.getOrCreateWidgetContainer(element);

    if (!container) {
      return false;
    }

    element.classList.add('hide');

    container.classList.remove('collapse');
    this.createAndInsertIframe(container);

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  setupActionElement(element) {
    console.log('🟡 AutoWidgetManager setupActionElement', element);
    console.log('🟡 Element classes BEFORE super.setupActionElement:', Array.from(element.classList));
    console.log('🟡 Element href:', element.getAttribute('href'));

    super.setupActionElement(element);

    console.log('🟡 Element classes AFTER super.setupActionElement:', Array.from(element.classList));

    element.classList.add('hide');

    console.log('🟡 Element classes AFTER adding hide:', Array.from(element.classList));
  }
}
