/* eslint-disable no-param-reassign */

import { isEmployee } from '../../../../utils/checks';

import { GLOBAL_CONFIG } from '../../config/config';

const FEATURE_CONFIG = {
  DEFAULT_SELECTED_VALUE: '',
  SELECTORS: {
    PAYMENT_SELECT: '#Payment_type',
    FIRST_OPTION: 'option:first-child',
    OTHER_OPTIONS: 'option:not(:first-child)',
  },
};

const sortOptionsByPriority = (options, priorityMethods) =>
  [...options].sort((optionA, optionB) => {
    const priorityA = priorityMethods.indexOf(optionA.value);
    const priorityB = priorityMethods.indexOf(optionB.value);

    // Если оба элемента найдены в массиве приоритетов
    if (priorityA !== -1 && priorityB !== -1) {
      return priorityA - priorityB;
    }

    // Элементы из приоритетного списка идут первыми
    if (priorityA !== -1) {
      return -1;
    }

    if (priorityB !== -1) {
      return 1;
    }

    // Остальные элементы сохраняют исходный порядок
    return 0;
  });

const updateSelectOptions = (selectElement, newOptions) => {
  selectElement.innerHTML = '';
  newOptions.forEach((option) => selectElement.appendChild(option));
};

const getSelectElements = (SELECTORS) => {
  const paymentSelect = document.querySelector(SELECTORS.PAYMENT_SELECT);

  if (!paymentSelect) {
    return null;
  }

  const firstOption = paymentSelect.querySelector(SELECTORS.FIRST_OPTION);
  const otherOptions = Array.from(paymentSelect.querySelectorAll(SELECTORS.OTHER_OPTIONS));

  return {
    paymentSelect,
    firstOption,
    otherOptions,
    selectedValue: paymentSelect.value,
  };
};

const restoreSelectedValue = (selectElement, selectedValue, DEFAULT_VALUE) => {
  if (selectedValue !== DEFAULT_VALUE) {
    selectElement.value = selectedValue;
  }
};

export const changePaymentList = () => {
  if (!isEmployee) {
    return;
  }

  const priorityPaymentMethods = GLOBAL_CONFIG.changePaymentList;

  if (!Array.isArray(priorityPaymentMethods)) {
    console.error('changePaymentList config is not an array');
    return;
  }

  const elements = getSelectElements(FEATURE_CONFIG.SELECTORS);

  if (!elements) {
    return;
  }

  const { paymentSelect, firstOption, otherOptions, selectedValue } = elements;

  const isFirstOptionEmpty = firstOption?.value === FEATURE_CONFIG.DEFAULT_SELECTED_VALUE;

  const sortedOptions = isFirstOptionEmpty
    ? [firstOption, ...sortOptionsByPriority(otherOptions, priorityPaymentMethods)]
    : sortOptionsByPriority([firstOption, ...otherOptions], priorityPaymentMethods);

  updateSelectOptions(paymentSelect, sortedOptions);
  restoreSelectedValue(paymentSelect, selectedValue, FEATURE_CONFIG.DEFAULT_SELECTED_VALUE);
};
