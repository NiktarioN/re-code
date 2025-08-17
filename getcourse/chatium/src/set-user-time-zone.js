/**
 * Plugin Name: set-user-time-zone
 * Description: Установить часовой пояс в карточку пользователя
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getGcUserData, getDealInfoWithParams, setUserCustomFields, updateDealInfo } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Установить часовой пояс в карточку пользователя»',
  REQUIRED_PARAMS: ['dealId'],
  FIELDS: {
    USER_TIME_ZONE: 10732289,
    DEAL_TIME_ZONE: 'Часовой_пояс',
  },
  MOSCOW_TIMEZONE: 3,
  UPDATE_DEAL_FIELD: true,
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_DEAL_ID: 'Некорректный идентификатор заказ',
  DEAL_NOT_FOUND: 'Заказ не найден',
  USER_NOT_FOUND: 'Пользователь не найден',
  NO_TIME_ZONE: 'У пользователя не определен часовой пояс',
  SUCCESS: (timeZone) => `Успешно определен часовой пояс пользователя: ${timeZone}`,
  GENERAL_ERROR: 'Ошибка при попытке установить часовой пояс в карточке пользователя и обновить поле заказа',
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }
};

const handleError = (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  error: error?.message || MESSAGES.GENERAL_ERROR,
});

const parseDealId = (dealIdStr) => {
  const dealId = Number.parseInt(dealIdStr, 10);

  if (Number.isNaN(dealId) || dealId <= 0) {
    throw new Error(MESSAGES.INVALID_DEAL_ID);
  }

  return dealId;
};

const formatMoscowTimeZone = (timeZoneValue) => {
  const moscowTimeZone = CONFIG.MOSCOW_TIMEZONE;

  const timeZone = typeof timeZoneValue === 'string' ? parseInt(timeZoneValue, 10) : timeZoneValue;

  if (timeZone === undefined || timeZone === null || Number.isNaN(timeZone)) {
    return 'Не определен';
  }

  const diffFromMoscow = timeZone - moscowTimeZone;

  if (diffFromMoscow > 0) {
    return `МСК+${diffFromMoscow}`;
  }

  if (diffFromMoscow < 0) {
    return `МСК${diffFromMoscow}`;
  }

  return 'МСК';
};

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);
    const dealId = parseDealId(req.query.dealId);

    const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: false, customFields: false });
    if (!dealInfo || !dealInfo.user_id) {
      throw new Error(MESSAGES.DEAL_NOT_FOUND);
    }

    const userId = dealInfo.user_id;
    const userInfo = await getGcUserData(ctx, { id: userId });
    if (!userInfo || !userInfo.user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const { timezone_offset: timeZoneOffset } = userInfo.user;
    const formattedTimeZone = formatMoscowTimeZone(timeZoneOffset);

    const successMessage = {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
    };

    if (formattedTimeZone === 'Не определен') {
      successMessage.message = MESSAGES.NO_TIME_ZONE;
    } else {
      successMessage.message = MESSAGES.SUCCESS(formattedTimeZone);
    }

    await setUserCustomFields(ctx, {
      userId,
      fields: {
        [CONFIG.FIELDS.USER_TIME_ZONE]: formattedTimeZone,
      },
    });

    if (CONFIG.UPDATE_DEAL_FIELD) {
      await updateDealInfo(ctx, {
        dealId,
        addfields: {
          [CONFIG.FIELDS.DEAL_TIME_ZONE]: [formattedTimeZone],
        },
      });
    }

    return successMessage;
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);
