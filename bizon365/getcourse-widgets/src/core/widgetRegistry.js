import GlobalDOMManager from "./GlobalDOMManager";

export const createAndRegisterWidget = (WidgetClass, config) => {
  const widget = new WidgetClass(config);
  widget.init();

  return widget;
};

window.addEventListener('beforeunload', () => {
  const globalDOMManager = GlobalDOMManager.getInstance();
  globalDOMManager.destroyAllWidgets();
});