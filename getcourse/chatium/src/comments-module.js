/**
 * Plugin Name: comments-module
 * Description: Модуль комментариев в задаче
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { addUserComment, addDealComment } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Модуль комментариев в задаче',
  REQUIRED_PARAMS: ['objectId', 'objectType', 'text'],
  NUMERIC_PARAMS: ['objectId', 'fromUserId'],
  ALLOWED_OBJECT_TYPES: ['deal', 'user'],
  OBJECT_ID_MAP: {
    deal: 'dealId',
    user: 'userId',
  },
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры: ${params}`,
  INVALID_NUMERIC_PARAM: (param) => `Параметр ${param} должен быть числом`,
  INVALID_OBJECT_TYPE: (type) => `Недопустимый тип объекта: ${type}`,
  GENERAL_ERROR: 'Ошибка при отправке комментария',
  SUCCESS: 'Комментарий успешно добавлен',
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !(param in params));
  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }

  CONFIG.NUMERIC_PARAMS.forEach((param) => {
    if (params[param] && Number.isNaN(Number(params[param]))) {
      throw new Error(MESSAGES.INVALID_NUMERIC_PARAM(param));
    }
  });

  if (!CONFIG.ALLOWED_OBJECT_TYPES.includes(params.objectType)) {
    throw new Error(MESSAGES.INVALID_OBJECT_TYPE(params.objectType));
  }
};

const handleError = async (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  errors: error.message || MESSAGES.GENERAL_ERROR,
});

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);

    const { objectId, objectType, text, fromUserId } = req.query;

    if (objectType === 'deal') {
      await addDealComment(ctx, {
        dealId: Number(objectId),
        comment: text,
        fromUserId: Number(fromUserId),
      });
    }

    if (objectType === 'user') {
      await addUserComment(ctx, objectId, text, fromUserId);
    }

    return {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: MESSAGES.SUCCESS,
    };
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);
