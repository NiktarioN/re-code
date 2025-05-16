import { CSS_PREFIX } from '../config/constants';
import { createElement } from '../../../../utils/dom';

class Modal {
  constructor() {
    this.modalElement = null;
    this.modalDialog = null;
    this.modalContent = null;
    this.isOpen = false;
    this.onClose = null;
    this.initModal();
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  initModal() {
    this.modalElement = createElement('div', { class: `${CSS_PREFIX}-modal` });
    this.modalDialog = createElement('div', { class: `${CSS_PREFIX}-modal-dialog` });
    this.modalContent = createElement('div', { class: `${CSS_PREFIX}-modal-content` });

    this.modalElement.append(this.modalDialog);
    this.modalDialog.append(this.modalContent);
  }

  setContent(content) {
    this.modalContent.innerHTML = '';

    if (content instanceof Node) {
      this.modalContent.append(content);
    } else {
      this.modalContent.innerHTML = content;
    }
  }

  open() {
    if (this.isOpen) {
      return;
    }

    document.body.style.overflow = 'hidden';
    document.body.appendChild(this.modalElement);

    requestAnimationFrame(() => {
      this.modalElement.classList.add(`${CSS_PREFIX}-modal--open`);
    });

    this.modalElement.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleKeyDown);

    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) {
      return;
    }

    if (this.onClose) {
      this.onClose();
    }

    document.body.style.overflow = '';

    this.modalElement.classList.remove(`${CSS_PREFIX}-modal--open`);

    this.modalElement.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyDown);

    this.isOpen = false;

    setTimeout(() => {
      if (this.modalElement.parentNode) {
        this.modalElement.parentNode.removeChild(this.modalElement);
      }
    }, 300);
  }

  setOnClose(callback) {
    this.onClose = callback;
  }

  handleOutsideClick(event) {
    if (event.target === this.modalElement) {
      this.close();
    }
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}

export default Modal;
