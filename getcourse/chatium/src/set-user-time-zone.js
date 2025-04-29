/**
 * Plugin Name: set-user-time-zone
 * Description: Установить часовой пояс в карточку пользователя
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getGcUserData, setUserCustomFields } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Установить часовой пояс в карточку пользователя»',
  REQUIRED_PARAMS: ['userId'],
  FIELDS: {
    TIME_ZONE: 10714712,
    RESPONSE: 10727741,
  },
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_USER_ID: 'Некорректный идентификатор пользователя',
  USER_NOT_FOUND: 'Пользователь не найден',
  NO_TIME_ZONE: 'У пользователя не определен часовой пояс',
  SUCCESS: (timeZone) => `Успешно определен часовой пояс пользователя: ${timeZone}`,
  GENERAL_ERROR: 'Ошибка при попытке установить часовой пояс в карточке пользователя',
};

const prepareData = (data) => (typeof data === 'object' ? JSON.stringify(data) : data);

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }
};

const handleError = async (error) => {
  const errorMessage = {
    plugin: `${CONFIG.PLUGIN_NAME}`,
    success: false,
    error: error.message || MESSAGES.GENERAL_ERROR,
  };

  return errorMessage;
};

const formatMoscowTimeZone = (timeZoneValue) => {
  const moscowTimeZone = 3;

  const timeZone = typeof timeZoneValue === 'string' ? parseInt(timeZoneValue, 10) : timeZoneValue;

  if (Number.isNaN(timeZone)) {
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

    const { userId: userIdStr } = req.query;
    const userId = parseInt(userIdStr, 10);

    if (Number.isNaN(userId) || userId <= 0) {
      throw new Error(MESSAGES.INVALID_USER_ID);
    }

    const userInfo = await getGcUserData(ctx, { id: userId });
    if (!userInfo) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const { timezone_offset: timeZoneOffset } = userInfo.user;

    const successMessage = {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
    };

    if (timeZoneOffset === undefined || timeZoneOffset === null) {
      successMessage.message = MESSAGES.NO_TIME_ZONE

      await setUserCustomFields(ctx, {
        userId,
        fields: {
          [CONFIG.FIELDS.TIME_ZONE]: 'Не определен',
          [CONFIG.FIELDS.RESPONSE]: prepareData(successMessage),
        },
      });

      return successMessage;
    }

    const formattedTimeZone = formatMoscowTimeZone(timeZoneOffset);
    successMessage.message = MESSAGES.SUCCESS(formattedTimeZone);
    successMessage.userTimeZone = timeZoneOffset;

    await setUserCustomFields(ctx, {
      userId,
      fields: {
        [CONFIG.FIELDS.TIME_ZONE]: formattedTimeZone,
        [CONFIG.FIELDS.RESPONSE]: prepareData(successMessage),
      },
    });

    return successMessage;
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);