/**
 * Plugin Name: forward-deal-info-to-user
 * Description: Перенос информации из заказа в пользователя для аналитики
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import {
  getDealInfoWithParams,
  setUserCustomFields,
  getDealInfo,
  getUserFields,
  updateDealInfo,
  setDealManager,
  addDealComment,
} from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: 'RE-CODE AGENCY. Передача информации между заказами',
  USER: {
    TARGET_FIELD_ID: 10680988,
    TARGET_FIELD_NAME: 'user_deal_forward_params',
  },
  DEAL: {
    FORWARDED_FIELD_IDS: [1292456, 1292457, 1292458, 1342238, 1236951],
    IGNORED_TAGS: [
      'тех_БЕЗ-ОБРАБОТКИ',
      'срм_АВТООПЛАТА',
      'срм_БЕЗ-ПМ',
      'срм_ПМ',
      'оп_ПРИОРИТЕТ-1',
      'оп_ПРИОРИТЕТ-2',
      'оп_ПРИОРИТЕТ-3',
    ],
    DEFAULT_FIELDS: {
      Дата_начала_работы: 'today',
      Дата_последнего_касания: 'today',
      Дата_выставления_счета: 'today',
      Действие_по_задаче: 'Контроль оплаты',
      Этап_доски_заказа: 'Выставлен счет',
      Был_контакт_с_клиентом: 1,
      Работал_ли_менеджер_с_заказом: 1,
      Создан_из_другого_заказа: 1,
      Кем_создан_заказ: 'Создан менеджером',
    },
  },
};

const FIELD_MAPPINGS = {
  1292456: 'utm_source',
  1292457: 'utm_medium',
  1292458: 'utm_campaign',
  1342238: 'utm_content',
  1236951: 'utm_term',
};

const MESSAGES = {
  ERROR_MISSING_DEAL_ID: 'Необходимо указать ID заказа',
  ERROR_OBJECT_INFO: 'Не удалось получить информацию об объекте',
  ERROR_SERVER: 'Произошла ошибка на сервере',
  ERROR_FAILED_UPDATE_DEAL: 'Не получилось обновить информацию в заказе',
  ERROR_FAILED_UPDATE_USER: 'Не получилось обновить информацию в пользователе',
  ERROR_NO_USER_FIELD: `Не найдено доп. поле "${CONFIG.USER.TARGET_FIELD_NAME}"`,
  SUCCESS: 'OK',
};

const getMoscowDate = () => {
  const currentDate = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return currentDate;
};

const TODAY = getMoscowDate();

const parseUserField = (userField) => {
  try {
    return JSON.parse(userField);
  } catch (error) {
    throw new Error(`Ошибка парсинга поля: ${CONFIG.USER.TARGET_FIELD_NAME}`);
  }
};

const getFilteredTags = (tags) => tags.filter((tag) => !CONFIG.DEAL.IGNORED_TAGS.includes(tag));

const getRelevantFields = (fields) =>
  fields
    .filter(({ id: fieldId }) => CONFIG.DEAL.FORWARDED_FIELD_IDS.includes(fieldId))
    .map(({ id, value }) => {
      const fieldName = FIELD_MAPPINGS[id];

      return { name: fieldName, value };
    });

const mergeFieldsWithDefaults = (fieldsFromDeal) => {
  const mergedFields = { ...CONFIG.DEAL.DEFAULT_FIELDS };

  fieldsFromDeal.forEach(({ name, value }) => {
    if (name) {
      mergedFields[name] = value;
    }
  });

  Object.keys(mergedFields).forEach((key) => {
    if (mergedFields[key] === 'today') {
      mergedFields[key] = TODAY;
    }
  });

  return mergedFields;
};

const forwardInfoToUser = async (ctx, dealId) => {
  const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: true, customFields: true });
  if (!dealInfo) {
    throw new Error(MESSAGES.ERROR_OBJECT_INFO);
  }

  const {
    user_id: userId,
    number: dealNumber,
    manager_user_id: dealManagerId,
    tags: dealTags,
    custom_fields: dealCustomFields,
  } = dealInfo;

  const filteredDealTags = getFilteredTags(dealTags);
  const relevantFields = getRelevantFields(dealCustomFields);
  const mergedFields = mergeFieldsWithDefaults(relevantFields);

  const dealParamsForUser = {
    dealNumber,
    dealManagerId,
    dealTags: filteredDealTags,
    dealFields: mergedFields,
  };

  const result = await setUserCustomFields(ctx, {
    userId,
    fields: {
      [CONFIG.USER.TARGET_FIELD_ID]: JSON.stringify(dealParamsForUser),
    },
  });

  if (!result || !Object.keys(result).length) {
    throw new Error(MESSAGES.ERROR_FAILED_UPDATE_USER);
  }

  return dealParamsForUser;
};

const saveInfoToDeal = async (ctx, dealId) => {
  const dealInfo = await getDealInfo(ctx, dealId);
  if (!dealInfo) {
    throw new Error(MESSAGES.ERROR_OBJECT_INFO);
  }

  const { user_id: userId } = dealInfo;

  const userInfo = await getUserFields(ctx, { userId });
  if (!userInfo) {
    throw new Error(MESSAGES.ERROR_OBJECT_INFO);
  }

  const { custom: userFields } = userInfo;
  const targetUserField = Object.values(userFields).find(({ name }) => name === CONFIG.USER.TARGET_FIELD_NAME)?.value;
  if (!targetUserField) {
    throw new Error(MESSAGES.ERROR_NO_USER_FIELD);
  }

  const targetUserFieldValue = parseUserField(targetUserField);
  const { dealNumber, dealManagerId, dealTags, dealFields } = targetUserFieldValue;

  await updateDealInfo(ctx, {
    dealId,
    addtags: dealTags,
    addfields: dealFields,
  });

  await setDealManager(ctx, { dealId, managerId: dealManagerId });

  await addDealComment(ctx, {
    dealId,
    comment: `Заказ обновлен информацией для аналитики из заказа #${dealNumber}`,
    fromUserId: userId,
  });

  return {
    dealId,
    dealNumber,
    dealManagerId,
    dealTags,
    dealFields,
  };
};

app.get('/forward-info-to-user', async (ctx, req) => {
  try {
    const { dealId: dealIdParam } = req.query;
    const dealId = dealIdParam ? parseInt(dealIdParam, 10) : null;

    if (!dealId) {
      throw new Error(MESSAGES.ERROR_MISSING_DEAL_ID);
    }

    const result = await forwardInfoToUser(ctx, dealId);
    return {
      status: MESSAGES.SUCCESS,
      data: result
    };
  } catch (error) {
    return {
      status: 'error',
      message: `${CONFIG.PLUGIN_NAME}. ${error.message}`
    };
  }
});

app.get('/save-info-to-deal', async (ctx, req) => {
  try {
    const { dealId: dealIdParam } = req.query;
    const dealId = dealIdParam ? parseInt(dealIdParam, 10) : null;

    if (!dealId) {
      throw new Error(MESSAGES.ERROR_MISSING_DEAL_ID);
    }

    const result = await saveInfoToDeal(ctx, dealId);
    return {
      status: MESSAGES.SUCCESS,
      data: result
    };
  } catch (error) {
    return {
      status: 'error',
      message: `${CONFIG.PLUGIN_NAME}. ${error.message}`
    };
  }
});
