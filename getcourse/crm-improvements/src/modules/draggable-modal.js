import { CSS_PREFIX } from '../config/constants';
import Modal from './modal';

class DraggableModal extends Modal {
  constructor() {
    super();
    this.isDragging = false;
    this.initialX = 0;
    this.initialY = 0;
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.addDragHandlers();
  }

  addDragHandlers() {
    const header = this.modalElement.querySelector(`.${CSS_PREFIX}-modal-header`);
    if (!header) {
      return;
    }

    header.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  onMouseDown(event) {
    this.isDragging = true;
    this.initialX = event.clientX - this.modalElement.offsetLeft;
    this.initialY = event.clientY - this.modalElement.offsetTop;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    event.preventDefault();
  }

  onMouseMove(event) {
    if (!this.isDragging) {
      return;
    }

    this.modalElement.style.left = `${event.clientX - this.initialX}px`;
    this.modalElement.style.top = `${event.clientY - this.initialY}px`;
  }

  onMouseUp() {
    this.isDragging = false;

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  destroy() {
    if (this.isDragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }

    super.destroy();
  }
}

export default DraggableModal;
