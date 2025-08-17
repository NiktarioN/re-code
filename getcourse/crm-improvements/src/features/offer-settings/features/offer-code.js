/* eslint-disable no-param-reassign */

import { currentUrl, getSearchParamValue } from '../../../../../../utils/url-utils';
import { isNumber } from '../../../../../../utils/checks';

import { notificationSystem } from '../../../modules/notification-system';
import { messageWithProjectNameShort } from '../../../common/messages';

import { CONFIG } from '../core/config';
import { createValidationResult } from '../common/validation-result';

const getOfferIdFromUrl = () => getSearchParamValue(currentUrl.href, 'id');

const getOfferCodeField = () => document.querySelector(CONFIG.SELECTORS.OFFER_CODE_FIELD);

const trimFieldValue = (field) => {
  const trimmedValue = field.value.trim();
  if (field.value !== trimmedValue) {
    field.value = trimmedValue;
  }

  return trimmedValue;
};

const updateFieldAndNotify = (field, newValue, message) => {
  field.value = newValue;

  notificationSystem.info(message, {
    duration: CONFIG.NOTIFICATION_DURATION,
    title: 'Изменение кода предложения',
  });
};

const handleEmptyField = (field, offerId) => {
  updateFieldAndNotify(
    field,
    offerId,
    'Уникальный код предложения изменен. Не забудьте сохранить изменения'
  );
};

const handleNumericField = (field, currentValue, offerId) => {
  updateFieldAndNotify(
    field,
    offerId,
    `Уникальный код предложения изменен c <strong>${currentValue}</strong> на <strong>${offerId}</strong>. Не забудьте сохранить изменения`
  );
};

const handleNonNumericField = (offerId) => {
  notificationSystem.warning(
    `Лучше указать в этом поле ID предложения из URL — <strong>${offerId}</strong>. Но сначала нужно убедиться, что данный код не используется где-то в другом месте на платформе или при интеграции с API`,
    {
      title: 'Рекомендация по коду предложения',
      persistent: true,
    }
  );
};

const processOfferCodeField = (field, offerId) => {
  const currentValue = trimFieldValue(field);

  if (currentValue === offerId) {
    return;
  }

  if (!currentValue) {
    handleEmptyField(field, offerId);
    return;
  }

  if (isNumber(currentValue)) {
    handleNumericField(field, currentValue, offerId);
    return;
  }

  handleNonNumericField(offerId);
};

const setupFieldValidation = (field) => {
  field.addEventListener('change', () => trimFieldValue(field));
  field.addEventListener('blur', () => trimFieldValue(field));
};

export const validateOfferCode = () => {
  const offerCodeField = getOfferCodeField();
  const offerId = getOfferIdFromUrl();

  if (!offerCodeField || !offerId) {
    return createValidationResult(true);
  }

  setupFieldValidation(offerCodeField);

  try {
    processOfferCodeField(offerCodeField, offerId);
    return createValidationResult(true);
  } catch (error) {
    console.error(messageWithProjectNameShort('Ошибка при обработке поля offer-code:'), error);
    return createValidationResult(false, 'Не удалось обработать поле "Уникальный код предложения"');
  }
};