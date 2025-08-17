import { createElement } from '../../../../utils/dom';

import { PROJECT_NAME_SHORT } from '../config/constants';

class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = new Map();
    this.nextId = 1;
    this.init();
  }

  init() {
    this.createContainer();
  }

  createContainer() {
    if (this.container) {
      return;
    }

    this.container = createElement('div', {
      'class': 'recode-notification-container',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    });

    document.body.appendChild(this.container);
  }

  enforceMaxNotifications() {
    if (this.notifications.size >= 5) {
      const oldestId = this.notifications.keys().next().value;
      this.hide(oldestId);
    }
  }

  show(message, type = 'info', options = {}) {
    const { duration = 5000, persistent = false, title = NotificationSystem.getDefaultTitle(type) } = options;

    this.enforceMaxNotifications();

    const notification = this.createNotification(message, type, title);
    const id = this.nextId;
    this.nextId += 1;

    this.notifications.set(id, notification);
    this.container.appendChild(notification);

    if (!persistent && duration > 0) {
      setTimeout(() => this.hide(id), duration);
    }

    return id;
  }

  hide(id) {
    const notification = this.notifications.get(id);
    if (!notification) {
      return;
    }

    notification.classList.add('recode-notification--removing');

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      this.notifications.delete(id);
    }, 300);
  }

  createNotification(message, type, title) {
    const notification = createElement('div', {
      class: `recode-notification recode-notification--${type}`,
    });

    const closeButton = createElement('button', {
      'class': 'recode-notification__close',
      'aria-label': 'Закрыть уведомление',
      'textContent': '×',
    });

    closeButton.addEventListener('click', () => {
      const id = Array.from(this.notifications.entries()).find(([, element]) => element === notification)?.[0];
      if (id) {
        this.hide(id);
      }
    });

    const header = createElement('div', {
      class: 'recode-notification__header',
      html: `
        <svg class="recode-notification__icon" viewBox="0 0 24 24" fill="currentColor">
          ${NotificationSystem.getIcon(type)}
        </svg>
        <span>${PROJECT_NAME_SHORT} ${title}</span>
      `,
    });

    const body = createElement('div', {
      class: 'recode-notification__body',
      html: message
    });

    notification.appendChild(closeButton);
    notification.appendChild(header);
    notification.appendChild(body);

    return notification;
  }

  static getDefaultTitle(type) {
    const titles = {
      error: 'Ошибка',
      warning: 'Предупреждение',
      info: 'Информация',
      success: 'Успех',
    };

    return titles[type] || 'Уведомление';
  }

  static getIcon(type) {
    const icons = {
      error: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      warning: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
      info: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
      success: '<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>',
    };

    return icons[type] || icons.info;
  }

  error(message, options = {}) {
    return this.show(message, 'error', { ...options, persistent: true });
  }

  warning(message, options = {}) {
    return this.show(message, 'warning', options);
  }

  info(message, options = {}) {
    return this.show(message, 'info', options);
  }

  success(message, options = {}) {
    return this.show(message, 'success', options);
  }

  clear() {
    this.notifications.forEach((_, id) => this.hide(id));
  }
}

// Создаем глобальный экземпляр
const notificationSystem = new NotificationSystem();

export { notificationSystem };