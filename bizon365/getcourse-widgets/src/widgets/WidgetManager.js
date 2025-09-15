import BaseWidgetManager from '../core/BaseWidgetManager';

export default class WidgetManager extends BaseWidgetManager {
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

    this.createAndInsertIframe(container);
    return true;
  }
}
