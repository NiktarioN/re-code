import WidgetManager from '../widgets/WidgetManager';
import TabWidgetManager from '../widgets/TabWidgetManager';
import AutoWidgetManager from '../widgets/AutoWidgetManager';
import { createAndRegisterWidget } from '../core/widgetRegistry';

export const recodeInitWidget = (config) => createAndRegisterWidget(WidgetManager, config);
export const recodeInitTabWidget = (config) => createAndRegisterWidget(TabWidgetManager, config);
export const recodeInitAutoWidget = (config) => createAndRegisterWidget(AutoWidgetManager, config);