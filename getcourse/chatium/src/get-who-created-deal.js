/**
 * Plugin Name: get-who-created-deal
 * Description: Узнаем кем был создан заказ
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getGcUserData, getDealInfo, updateDealInfo } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: 'RE-CODE AGENCY. Плагин «Узнаем кем был создан заказ»',
  TARGET_FIELD_NAME: 'Кем_создан_заказ',
  MANAGERS_GROUPS_IDS: [3903691, 3861446],
  CREATOR_TYPES: {
    EMPLOYEE: 'Создан сотрудником не менеджером',
    MANAGER: 'Создан менеджером',
    CLIENT: 'Создан самим клиентом',
    SYSTEM: 'Создан системой',
  },
  MESSAGES: {
    MISSING_DEAL_ID: 'Отсутствует параметр dealId в запросе',
    INVALID_DEAL_ID: 'Некорректный идентификатор заказа',
    DEAL_NOT_FOUND: 'Заказ не найден',
    USER_NOT_FOUND: 'Пользователь-создатель заказа не найден',
    NO_TARGET_PARAM: (paramName) => `Обязательный параметр «${paramName}» не найден или имеет неккоректный формат`,
    NO_TARGET_FIELD: (fieldName) => `Обязательное дополнительное поле ${fieldName}» не найдено`,
    SUCCESS: (type) => `Заказ успешно обновлен. Тип создателя: ${type}`,
    GENERAL_ERROR: 'Ошибка при попытке узнать кем был создан заказ',
  },
};

const isInGroup = (groups, groupsIds) => groups.some((group) => groupsIds.includes(group.id));

const getCreatorData = async (ctx, creatorUserId) => {
  if (!creatorUserId) {
    return null;
  }

  const userData = await getGcUserData(ctx, {
    id: creatorUserId,
    blocks: ['groups'],
  });

  if (!userData || !userData.user) {
    throw new Error(CONFIG.MESSAGES.USER_NOT_FOUND);
  }

  return userData;
};

const determineCreatorTypeAndUpdate = async (ctx, dealId, userData, clientId) => {
  const creatorType = (() => {
    if (!userData) {
      return CONFIG.CREATOR_TYPES.SYSTEM;
    }

    const { user, groups } = userData;
    const isEmployee = user.role === 'teacher' || user.role === 'admin';
    const isManager = isEmployee && isInGroup(groups, CONFIG.MANAGERS_GROUPS_IDS);

    if (isManager) {
      return CONFIG.CREATOR_TYPES.MANAGER;
    }
    if (isEmployee) {
      return CONFIG.CREATOR_TYPES.EMPLOYEE;
    }
    if (user.id === clientId) {
      return CONFIG.CREATOR_TYPES.CLIENT;
    }
    return CONFIG.CREATOR_TYPES.SYSTEM;
  })();

  await updateDealInfo(ctx, {
    dealId,
    addfields: {
      [CONFIG.TARGET_FIELD_NAME]: creatorType,
    },
  });

  return creatorType;
};

const handleRequest = async (ctx, req) => {
  try {
    const { dealId: dealIdParam } = req.query;

    if (!dealIdParam) {
      throw new Error(CONFIG.MESSAGES.MISSING_DEAL_ID);
    }

    const dealId = parseInt(dealIdParam, 10);

    if (Number.isNaN(dealId) || dealId <= 0) {
      throw new Error(CONFIG.MESSAGES.INVALID_DEAL_ID);
    }

    const dealInfo = await getDealInfo(ctx, dealId);
    if (!dealInfo) {
      throw new Error(CONFIG.MESSAGES.DEAL_NOT_FOUND);
    }

    const clientId = dealInfo.user_id;
    if (!clientId) {
      throw new Error(CONFIG.MESSAGES.NO_TARGET_PARAM('user_id'));
    }

    const creatorUserData = await getCreatorData(ctx, dealInfo.created_user_id);

    const creatorType = await determineCreatorTypeAndUpdate(ctx, dealId, creatorUserData, clientId);

    return CONFIG.MESSAGES.SUCCESS(creatorType);
  } catch (error) {
    return `${CONFIG.PLUGIN_NAME}. ${error.message || CONFIG.MESSAGES.GENERAL_ERROR}`;
  }
};

app.get('/', handleRequest);