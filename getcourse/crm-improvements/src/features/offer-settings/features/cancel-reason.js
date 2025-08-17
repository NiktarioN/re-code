/* eslint-disable no-param-reassign */

import { SelectorJS } from '../../../../../../utils/selector-js';

import { messageWithProjectNameShort } from '../../../common/messages';

import { CONFIG } from '../core/config';
import { MESSAGES } from '../common/messages';
import { createValidationResult } from '../common/validation-result';

const getExpectedReasonId = (cancelReasonsIds, isPaidOffer) => {
  const { free, paid } = cancelReasonsIds;
  return String(isPaidOffer ? paid : free);
};

const handleStrictModeValidation = (cancelSelect, cancelReasonsIds, isPaidOffer) => {
  const expectedReasonId = getExpectedReasonId(cancelReasonsIds, isPaidOffer);
  const currentValue = cancelSelect.value;

  if (currentValue === expectedReasonId) {
    return createValidationResult(true);
  }

  const wrongReasonId = getExpectedReasonId(cancelReasonsIds, !isPaidOffer);
  const hasWrongReason = currentValue === wrongReasonId;

  if (hasWrongReason || !cancelSelect.hasSelection) {
    cancelSelect.value = expectedReasonId;

    const isSetCorrectly = cancelSelect.value === expectedReasonId;
    const message = isSetCorrectly ? null : MESSAGES.STRICT_MODE_ERROR(isPaidOffer);

    return createValidationResult(isSetCorrectly, message);
  }

  return createValidationResult(true);
};

const handleNormalModeValidation = (cancelSelect, isPaidOffer) => {
  const { hasSelection } = cancelSelect;
  const message = hasSelection ? null : MESSAGES.REQUIRED(isPaidOffer);

  return createValidationResult(hasSelection, message);
};


export const validateCancelReason = (config) => {
  const { strictMode, ids: cancelReasonsIds, offerPrice } = config;
  const isPaidOffer = offerPrice > 0;

  try {
    const cancelSelect = new SelectorJS(CONFIG.SELECTORS.CANCEL_REASON);

    return strictMode ? handleStrictModeValidation(cancelSelect, cancelReasonsIds, isPaidOffer) : handleNormalModeValidation(cancelSelect, isPaidOffer);
  } catch (error) {
    console.error(messageWithProjectNameShort('Ошибка при валидации причины отмены:'), error);
    return createValidationResult(false, 'Не удалось проверить причину отмены заказа');
  }
};