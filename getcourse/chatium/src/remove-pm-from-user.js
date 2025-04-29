/**
 * Plugin Name:
 * Description: Сбросить персонального менеджера у пользователя
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getGcUserData, addUserComment } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Сбросить персонального менеджера у пользователя»',
  REQUIRED_PARAMS: ['userId'],
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_USER_ID: 'Некорректный идентификатор пользователя',
  USER_NOT_FOUND: 'Пользователь не найден',
  MANAGER_NOT_FOUND: (id) => `Персональный менеджер пользователя (ID: ${id}) не найден`,
  USER_DOES_NOT_HAVE_MANAGER: 'У пользователя нет персонального менеджера',
  SUCCESS: (name, id) => `Сброшен персональный менеджер: ${name} (ID: ${id})`,
  GENERAL_ERROR: 'Ошибка при попытке сбросить персонального менеджера у пользователя',
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }
};

const handleError = async (error) => {
  const errorMessage = {
    plugin: CONFIG.PLUGIN_NAME,
    success: false,
    error: error.message || MESSAGES.GENERAL_ERROR,
  };

  return errorMessage;
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

    const { personal_manager_user_id: personalManagerId } = userInfo.user;
    if (!personalManagerId) {
      throw new Error(MESSAGES.USER_DOES_NOT_HAVE_MANAGER);
    }

    const managerInfo = await getGcUserData(ctx, { id: personalManagerId });
    if (!managerInfo || !managerInfo.user) {
      throw new Error(MESSAGES.MANAGER_NOT_FOUND(personalManagerId));
    }

    const managerName = `${managerInfo.user.first_name} ${managerInfo.user.last_name}`.trim();

    const successMessage = MESSAGES.SUCCESS(managerName, personalManagerId);

    await addUserComment(ctx, userId, successMessage);

    const resultMessage = {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: successMessage,
    };

    return resultMessage;
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);