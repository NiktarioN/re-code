/* eslint-disable no-console */

import { waitForElement } from '../../../../../utils/dom';
import { isDealPage, isUserControlPage } from '../../../../utils/page-checker';

const createInputCopy = (objectType) => {
  const inputCopyElement = document.createElement('input');
  inputCopyElement.setAttribute('type', 'hidden');
  inputCopyElement.setAttribute('name', objectType === 'user' ? 'User[valueSetString]' : 'Deal[valueSetString]');
  inputCopyElement.id = 'recode-value-set-string-copy';
  inputCopyElement.value = JSON.stringify({});

  return inputCopyElement;
}

const watchInputChanges = async (currentInputSelector, objectType) => {
  const inputElement = document.querySelector(currentInputSelector) || (await waitForElement(currentInputSelector, 60000));
  if (!inputElement) {
    return;
  }

  const copyInput = createInputCopy(objectType);
  inputElement.after(copyInput);

  const initialData = JSON.parse(inputElement.value || '{}');

  const handleInputChange = (newData) => {
    const updatedData = Object.entries(newData).reduce((acc, [key, value]) => {
      if (value !== initialData[key]) {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('RE-CODE. Новые значения для valueSetString: ', updatedData);

    if (Object.keys(updatedData).length) {
      copyInput.value = JSON.stringify(updatedData);
    }
  };

  const observer = new MutationObserver(() => {
    const newValue = inputElement.value ? JSON.parse(inputElement.value) : {};
    if (Object.keys(newValue).length) {
      handleInputChange(newValue);
    }
  });

  observer.observe(inputElement, { attributes: true, attributeFilter: ['value'] });
};

const initWatcher = async () => {
  if (isDealPage) {
    await watchInputChanges('[name="Deal[valueSetString]"', 'deal');
  }

  if (isUserControlPage) {
    await watchInputChanges('[name="User[valueSetString]"', 'user');
  }
};

export default initWatcher;