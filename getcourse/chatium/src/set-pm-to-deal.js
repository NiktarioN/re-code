/**
 * Plugin Name: set-pm-to-deal
 * Description: Закрепить персонального менеджера в заказе
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getGcUserData, getDealInfoWithParams, setDealManager, addDealComment } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Закрепить персонального менеджера в заказе»',
  REQUIRED_PARAMS: ['dealId'],
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_DEAL_ID: 'Некорректный идентификатор заказа',
  DEAL_NOT_FOUND: 'Заказ не найден',
  USER_DOES_NOT_HAVE_MANAGER: 'У пользователя нет персонального менеджера',
  MANAGER_NOT_FOUND: (id) => `Персональный менеджер пользователя (ID: ${id}) не найден`,
  SUCCESS: (name, id) => `Итог распределения: Распределен на персонального менеджера клиента — ${name} (ID: ${id})`,
  GENERAL_ERROR: 'Ошибка при попытке закрепить персонального менеджера в заказе',
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

    const { dealId: dealIdStr } = req.query;
    const dealId = parseInt(dealIdStr, 10);

    if (Number.isNaN(dealId) || dealId <= 0) {
      throw new Error(MESSAGES.INVALID_DEAL_ID);
    }

    const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: false, customFields: false });
    if (!dealInfo) {
      throw new Error(MESSAGES.DEAL_NOT_FOUND);
    }

    const userInfo = await getGcUserData(ctx, { id: dealInfo.user_id });

    const { personal_manager_user_id: personalManagerId } = userInfo.user;
    if (!personalManagerId) {
      throw new Error(MESSAGES.USER_DOES_NOT_HAVE_MANAGER);
    }

    const managerInfo = await getGcUserData(ctx, { id: personalManagerId });
    if (!managerInfo || !managerInfo.user) {
      throw new Error(MESSAGES.MANAGER_NOT_FOUND(personalManagerId));
    }

    const managerName = `${managerInfo.user.first_name} ${managerInfo.user.last_name}`.trim();

    await setDealManager(ctx, { dealId, managerId: personalManagerId });

    const resultMessage = {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: MESSAGES.SUCCESS(managerName, personalManagerId),
    };

    await addDealComment(ctx, {
      dealId,
      comment: resultMessage.message,
      fromUserId: dealInfo.user_id,
    });

    return resultMessage;
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);
