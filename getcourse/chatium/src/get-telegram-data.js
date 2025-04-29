/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

/**
 * Plugin Name: get-telegram-data
 * Description: Получить данные о пользователе в Telegram
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getUserCustomFields, setUserCustomFields, getUserTelegramChats } from '@getcourse/sdk';
import { get } from '@app/request';

const CONFIG = {
  PLUGIN_NAME: 'RE-CODE AGENCY. Плагин «Получение данный пользователя в Telegram»',
  FIELDS: {
    USERNAME: 'tg_username',
    ID: 'tg_id',
  },
  MESSAGES: {
    MISSING_PARAMS: (missingParams) => `Не хватает параметров: ${missingParams.join(', ')} в ссылке блока "Вызвать URL"`,
    INVALID_USER_ID: 'Некорректный идентификатор пользователя',
    NO_CHAT_ID: 'Не найден Telegram chat ID пользователя',
    NO_FIELDS: (missingFields) => `Обязательные дополнительные поля для плагина не найдены: ${missingFields.join(', ')}`,
    GENERAL_ERROR: 'Ошибка в получении логина Telegram',
    CANT_GET_DATA_TG: 'Не удалось получить данные из Telegram API после использования всех токенов',
    API_REQUEST_FAILED: 'Ошибка запроса к Telegram API',
  },
  TELEGRAM_API: {
    GET_CHAT_URL: (token, chatId) => `https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`,
  },
};

const validateRequestParams = (userIdParam, tokenParam) => {
  const missingParams = [];

  if (!userIdParam) {
    missingParams.push('userId');
  }

  const tokens = tokenParam ? tokenParam.split(',').map((token) => token.trim()) : [];
  if (!tokens.length) {
    missingParams.push('token');
  }

  if (missingParams.length) {
    throw new Error(CONFIG.MESSAGES.MISSING_PARAMS(missingParams));
  }

  const userId = Number(userIdParam);
  if (Number.isNaN(userId) || userId <= 0) {
    throw new Error(CONFIG.MESSAGES.INVALID_USER_ID);
  }

  return { userId, tokens };
};

const validateCustomFields = (fields, requiredFields) => {
  const fieldsNames = Object.values(requiredFields);

  const missingFields = fieldsNames.filter((name) => !fields.some((field) => field.title === name));
  if (missingFields.length) {
    throw new Error(CONFIG.MESSAGES.NO_FIELDS(missingFields));
  }

  return fieldsNames.reduce((acc, fieldName) => {
    const targetField = fields.find((field) => field.title === fieldName);

    return { ...acc, [fieldName]: targetField.id };
  }, {});
};

const getTelegramData = async (tokens, chatId) => {
  const errors = [];

  for (const token of tokens) {
    try {
      const response = await get(CONFIG.TELEGRAM_API.GET_CHAT_URL(token, chatId));

      if (response.body?.ok && response.body.result) {
        return {
          id: response.body.result.id,
          username: response.body.result.username || '',
        };
      }
    } catch (error) {
      errors.push(error);
    }
  }

  throw new Error(CONFIG.MESSAGES.CANT_GET_DATA_TG);
};

const handleTelegramDataRequest = async (ctx, req) => {
  try {
    const { userId: userIdParam, token } = req.query;
    const { userId, tokens } = validateRequestParams(userIdParam, token);

    const telegramData = await getUserTelegramChats(ctx, { userId });
    const tgChatId = telegramData.find((item) => item.chat_id)?.chat_id;

    if (!tgChatId) {
      throw new Error(CONFIG.MESSAGES.NO_CHAT_ID);
    }

    const customFields = await getUserCustomFields(ctx);
    const targetFields = validateCustomFields(customFields, CONFIG.FIELDS);

    const tgData = await getTelegramData(tokens, tgChatId);
    const { id: tgId, username: tgUsername } = tgData;

    await setUserCustomFields(ctx, {
      userId,
      fields: {
        [targetFields[CONFIG.FIELDS.USERNAME]]: tgUsername,
        [targetFields[CONFIG.FIELDS.ID]]: tgId,
      },
    });

    return 'OK';
  } catch (error) {
    return `${CONFIG.PLUGIN_NAME}. ${error.message || CONFIG.MESSAGES.GENERAL_ERROR}`;
  }
};

app.get('/', handleTelegramDataRequest);