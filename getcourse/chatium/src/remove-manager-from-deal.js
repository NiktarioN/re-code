/**
 * Plugin Name: remove-manager-from-deal
 * Description: Сбросить менеджера заказа
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getGcUserData, getDealInfoWithParams, setDealManager, addDealComment } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Сбросить менеджера заказа»',
  REQUIRED_PARAMS: ['dealId'],
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_DEAL_ID: 'Некорректный идентификатор заказа',
  DEAL_NOT_FOUND: 'Заказ не найден',
  NO_MANAGER_IN_DEAL: 'В заказе нет менеджера',
  MANAGER_NOT_FOUND: (id) => `Менеджер заказа (ID: ${id}) не найден`,
  SUCCESS: (name, id) => `Сброшен менеджер заказа — ${name} (ID: ${id}). Его нет в списке актуальных менеджеров по заказам`,
  GENERAL_ERROR: 'Ошибка при попытке сбросить менеджера заказа',
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

    const dealManagerId = dealInfo.manager_user_id;
    if (!dealManagerId) {
      throw new Error(MESSAGES.NO_MANAGER_IN_DEAL)
    }

    const managerInfo = await getGcUserData(ctx, { id: dealManagerId });
    if (!managerInfo || !managerInfo.user) {
      throw new Error(MESSAGES.MANAGER_NOT_FOUND(dealManagerId));
    }

    const managerName = `${managerInfo.user.first_name} ${managerInfo.user.last_name}`.trim();

    const successMessage = MESSAGES.SUCCESS(managerName, dealManagerId);

    await setDealManager(ctx, { dealId, managerId: null });

    await addDealComment(ctx, {
      dealId,
      comment: successMessage,
    });

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