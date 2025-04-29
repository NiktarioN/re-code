/**
 * Plugin Name: check-manager-is-working
 * Description: Проверить работает ли менеджер
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getGcUserData, getDealInfoWithParams, setDealManager, addDealComment } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Проверить работает ли менеджер»',
  REQUIRED_PARAMS: ['dealId'],
  TARGET_GROUP_ID: 4205317,
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_DEAL_ID: 'Некорректный идентификатор заказа',
  DEAL_NOT_FOUND: 'Заказ не найден',
  USER_DOES_NOT_HAVE_MANAGER: 'У пользователя нет персонального менеджера. Ничего не делаем с менеджером заказа',
  MANAGER_NOT_WORKING: 'Менеджер сейчас не работает',
  MANAGER_NOT_FOUND: (id) => `Персональный менеджер (ID: ${id}) не найден`,
  MANAGER_IS_WORKING: 'Менеджер работает, изменения не требуются',
  NO_ACTION_NEEDED: 'Ничего не делаем с менеджером заказа',
  SUCCESS: (name, id) =>
    `Сброшен менеджер заказа — ${name} (ID: ${id}). Сейчас он не работает (отпуск или другая причина)`,
  GENERAL_ERROR: 'Ошибка при попытке проверить работает ли менеджер заказа',
};

const isInGroup = (groups, targetGroupId) => groups.some((group) => group.id === targetGroupId);

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
    const userId = dealInfo.user_id;

    const userInfo = await getGcUserData(ctx, { id: userId, blocks: ['groups'] });
    const { personal_manager_user_id: personalManagerId } = userInfo.user;

    const resultMessage = {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
    };

    if (!personalManagerId) {
      resultMessage.message = MESSAGES.USER_DOES_NOT_HAVE_MANAGER;

      return resultMessage;
    }

    const managerInfo = await getGcUserData(ctx, { id: personalManagerId });
    if (!managerInfo || !managerInfo.user) {
      throw new Error(MESSAGES.MANAGER_NOT_FOUND(personalManagerId));
    }

    const managerName = `${managerInfo.user.first_name} ${managerInfo.user.last_name}`.trim();

    const userGroups = userInfo.groups || [];
    const isManagerNotWorking = isInGroup(userGroups, CONFIG.TARGET_GROUP_ID);

    if (dealManagerId === personalManagerId && isManagerNotWorking) {
      await setDealManager(ctx, { dealId, managerId: null });

      resultMessage.message = MESSAGES.SUCCESS(managerName, personalManagerId);

      await addDealComment(ctx, {
        dealId,
        comment: resultMessage.message,
      });

      return resultMessage;
    }

    resultMessage.message = isManagerNotWorking ? MESSAGES.MANAGER_NOT_WORKING : MESSAGES.MANAGER_IS_WORKING;

    return resultMessage;
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);