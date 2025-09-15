import { CONFIG } from '../core/config';

const WIDGET_STYLES = `
.${CONFIG.WIDGET_BASE_NAME} {
  margin: 10px 0;
}

.${CONFIG.WIDGET_BASE_NAME} .nav-tabs {
  display: flex;
  justify-content: center;
  border: none;
  margin-bottom: 10px;
  background: none;
  gap: 8px;
}

.${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li {
  margin-bottom: 0;
}

.${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li > a {
  margin: 0;
  border: 1px solid;
  border-color: #d0d0d0;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
  color: #939393;
  background-color: #f8f8f8;
  outline: none;
  transition: color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
}

.${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li.active > a {
  color: #232323;
  background-color: #ffffff;
  cursor: default;
}

.${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li > a:hover,
.${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li > a:focus,
.${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li > a:active {
  color: #232323;
  background-color: #ffffff;
  border-color: #d0d0d0;
}

.${CONFIG.WIDGET_BASE_NAME} .tab-content {
  background: none;
  border-radius: 12px;
  overflow: hidden;
}

.${CONFIG.WIDGET_BASE_NAME} .tab-pane {
  padding: 0;
  min-height: 200px;
}

@media (max-width: 768px) {
  .${CONFIG.WIDGET_BASE_NAME} .nav-tabs {
    flex-direction: column;
    align-items: center;
  }

  .${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li {
    width: 100%;
    max-width: 280px;
  }

  .${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li > a {
    text-align: center;
    padding: 14px 20px;
  }
}

@media (max-width: 480px) {
  .${CONFIG.WIDGET_BASE_NAME} .nav-tabs > li > a {
    padding: 12px 16px;
    font-size: 13px;
  }
}
`;

export const injectWidgetStyles = () => {
  if (document.getElementById('recode-widget-styles')) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'recode-widget-styles';
  styleElement.textContent = WIDGET_STYLES;

  document.head.appendChild(styleElement);
};