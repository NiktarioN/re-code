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
  TARGET_GROUP_ID: 4257660,
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_DEAL_ID: 'Некорректный идентификатор заказа',
  DEAL_NOT_FOUND: 'Заказ не найден',
  USER_DOES_NOT_HAVE_MANAGER: 'У пользователя нет персонального менеджера. Ничего не делаем с менеджером заказа',
  MANAGER_NOT_WORKING: 'Менеджер сейчас не работает',
  MANAGER_NOT_FOUND: (id) => `Персональный менеджер (ID: ${id}) не найден`,
  MANAGER_IS_WORKING: 'Менеджер работает или сам создал заказ, изменения не требуются',
  NO_ACTION_NEEDED: 'Ничего не делаем с менеджером заказа',
  SUCCESS: (name, id) =>
    `Сброшен менеджер заказа — ${name} (ID: ${id}). Сейчас он не работает (отпуск или другая причина)`,
  GENERAL_ERROR: 'Ошибка при попытке проверить работает ли менеджер заказа',
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }
};

const parseDealId = (dealIdStr) => {
  const dealId = Number.parseInt(dealIdStr, 10);

  if (Number.isNaN(dealId) || dealId <= 0) {
    throw new Error(MESSAGES.INVALID_DEAL_ID);
  }

  return dealId;
};

const isUserInGroup = (groups, targetGroupId) => groups.some((group) => group.id === targetGroupId);

const handleError = (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  error: error?.message || MESSAGES.GENERAL_ERROR,
});

const removeManagerAndComment = async (ctx, dealId, message) => {
  await setDealManager(ctx, { dealId, managerId: null });
  await addDealComment(ctx, { dealId, comment: message });

  return {
    plugin: CONFIG.PLUGIN_NAME,
    success: true,
    message,
  };
};

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);

    const dealId = parseDealId(req.query.dealId);

    const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: false, customFields: false });
    if (!dealInfo) {
      throw new Error(MESSAGES.DEAL_NOT_FOUND);
    }

    const { manager_user_id: dealManagerId, created_user_id: dealCreatedUserId, user_id: userId } = dealInfo;

    const userInfo = await getGcUserData(ctx, { id: userId, blocks: ['groups'] });
    const { personal_manager_user_id: personalManagerId } = userInfo.user;

    if (!personalManagerId) {
      return {
        plugin: CONFIG.PLUGIN_NAME,
        success: true,
        message: MESSAGES.USER_DOES_NOT_HAVE_MANAGER,
      };
    }

    const managerInfo = await getGcUserData(ctx, { id: personalManagerId });
    if (!managerInfo?.user) {
      throw new Error(MESSAGES.MANAGER_NOT_FOUND(personalManagerId));
    }

    const managerName = `${managerInfo.user.first_name} ${managerInfo.user.last_name}`.trim();

    const userGroups = userInfo.groups || [];
    const managerIsNotWorking = isUserInGroup(userGroups, CONFIG.TARGET_GROUP_ID);
    const managerIsDealCreator = dealCreatedUserId === dealManagerId;

    if (dealManagerId === personalManagerId && managerIsNotWorking && !managerIsDealCreator) {
      return await removeManagerAndComment(ctx, dealId, MESSAGES.SUCCESS(managerName, personalManagerId));
    }

    return {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: MESSAGES.MANAGER_IS_WORKING,
    };
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);