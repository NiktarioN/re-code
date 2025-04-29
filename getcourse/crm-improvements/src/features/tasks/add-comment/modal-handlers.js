import { getSettings, updateSettings } from '../../../modules/settings-manager';
import { updateCounter, resetCounter } from './counter';
import setStatusMessage from './status-messages';

const openModal = (modalElements) => {
  const { modal, textarea, counter, statusMessage } = modalElements;
  const settings = getSettings();
  textarea.value = settings?.tasks?.draftComment || '';
  textarea.focus();

  if (counter) {
    updateCounter(textarea, counter)
  }

  if (statusMessage) {
    setStatusMessage(statusMessage, '', '');
  }

  modal.open();
};

const closeModal = (modalElements) => {
  const { modal, textarea } = modalElements;
  const trimmedText = textarea.value.trim();

  if (trimmedText) {
    updateSettings({ tasks: { draftComment: trimmedText } });
  }

  modal.close();
};

const resetForm = (modalElements) => {
  const { textarea, statusMessage, counter } = modalElements;

  textarea.value = '';

  if (statusMessage) {
    setStatusMessage(statusMessage, '', '');
  }

  if (counter) {
    resetCounter(counter);
  }

  updateSettings({ tasks: { draftComment: '' } });
};

export { openModal, closeModal, resetForm };
