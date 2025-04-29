/**
 * Plugin Name: set-pm-to-deal
 * Description: Закрепить персонального менеджера в заказе
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getDealInfoWithParams, updateDealInfo, setDealManager, addDealComment } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Закрепить менеджера в заказ после распределения»',
  REQUIRED_PARAMS: ['dealId'],
  FIELD: {
    ID: 10714703,
    NAME: 'Номер_менеджера_после_распределения',
  },
  MANAGERS: {
    1: {
      id: 381462696,
      name: 'Диана Саламаха',
    },
    2: {
      id: 371028893,
      name: 'Луиза Чумакова',
    },
    3: {
      id: 364726233,
      name: 'Юлия Зубова',
    },
    4: {
      id: 400823809,
      name: 'Лара Густо',
    },
    5: {
      id: 420235009,
      name: 'Ирина Ольшанская',
    },
    6: {
      id: 421185336,
      name: 'Светлана Баж',
    },
    7: {
      id: 431884562,
      name: 'Анастасия Романова',
    },
    8: {
      id: 435551384,
      name: 'Виктор Скамьин',
    },
    9: {
      id: 436769929,
      name: 'Ирина Серебрякова',
    },
    10: {
      id: 437772182,
      name: 'Ирина Сурина',
    },
    11: {
      id: 436770945,
      name: 'Екатерина Миронова',
    },
    12: {
      id: 441961537,
      name: 'Юлия Смирнова',
    },
    13: {
      id: 313324735,
      name: 'Анастасия Афонина',
    },
    14: {
      id: 372779360,
      name: 'Нина Мамычева',
    },
    15: {
      id: 419964362,
      name: 'Нарине Минасян',
    },
    16: {
      id: 426951134,
      name: 'Анастасия Теплякова',
    },
    17: {
      id: 427933649,
      name: 'Камила Шамаева',
    },
    18: {
      id: 431888002,
      name: 'Максим Синчило',
    },
    19: {
      id: 431891084,
      name: 'Юрий Смирнов',
    },
    20: {
      id: 427760502,
      name: 'Наталья Евдокимова',
    },
    21: {
      id: 440661774,
      name: 'Антон Дзюмак',
    },
    22: {
      id: 441958175,
      name: 'Елена Тодорожко',
    },
  },
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_DEAL_ID: 'Некорректный идентификатор заказа',
  FIELD_NOT_FOUND: `Поле «${CONFIG.FIELD.NAME}» не найдено`,
  INCORRECT_FIELD_VALUE: (value) => `Поле «${CONFIG.FIELD.NAME}» имеет некорректное значение — ${value}`,
  DEAL_NOT_FOUND: 'Заказ не найден',
  MANAGER_NOT_FOUND: (number) => `Менеджер с ID ${number} не найден в конфигурации`,
  INVALID_MANAGER_ID: (number) => `Менеджер с ID ${number} имеет некорректный формат`,
  DISTRIBUTION_ERROR: (number) => `Некорректный номер менеджера: ${number}`,
  SUCCESS: (name, id) => `Итог распределения: Заказ автораспределен на менеджера — ${name} (ID: ${id})`,
  GENERAL_ERROR: 'Ошибка при попытке закрепить менеджера в заказе',
};

const prepareData = (data) => (typeof data === 'object' ? JSON.stringify(data) : data);

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }
};

const handleError = async (ctx, dealId, error) => {
  const errorMessage = {
    plugin: CONFIG.PLUGIN_NAME,
    success: false,
    error: error.message || MESSAGES.GENERAL_ERROR,
  };

  if (dealId) {
    await updateDealInfo(ctx, {
      dealId,
      addfields: { deal_response: 'ERROR', deal_response_msg: prepareData(errorMessage) },
    });
  }

  return errorMessage;
};

const parseManagerNumber = (fieldValue) => {
  const valueStr = String(fieldValue).trim();

  if (!valueStr || !/^\d+$/.test(valueStr)) {
    throw new Error(MESSAGES.INCORRECT_FIELD_VALUE(fieldValue));
  }

  return parseInt(valueStr, 10);
};

const getManagerData = (managerNumber) => {
  const manager = CONFIG.MANAGERS[managerNumber];

  if (!manager) {
    throw new Error(MESSAGES.MANAGER_NOT_FOUND(managerNumber));
  }

  if (typeof manager.id !== 'number' || manager.id <= 0) {
    throw new Error(MESSAGES.INVALID_MANAGER_ID(managerNumber));
  }

  return manager;
};

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);

    const { dealId: dealIdStr } = req.query;
    const dealId = parseInt(dealIdStr, 10);

    if (Number.isNaN(dealId) || dealId <= 0) {
      throw new Error(MESSAGES.INVALID_DEAL_ID);
    }

    const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: false, customFields: true });
    if (!dealInfo) {
      throw new Error(MESSAGES.DEAL_NOT_FOUND);
    }

    const targetField = dealInfo.custom_fields.find((field) => field.id === CONFIG.FIELD.ID);
    if (!targetField || !targetField.value) {
      throw new Error(MESSAGES.FIELD_NOT_FOUND);
    }

    const managerNumber = parseManagerNumber(targetField.value);
    if (managerNumber <= 0) {
      throw new Error(MESSAGES.DISTRIBUTION_ERROR(managerNumber))
    }

    const manager = getManagerData(managerNumber);

    const resultMessage = {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: MESSAGES.SUCCESS(manager.name, manager.id),
    };

    await setDealManager(ctx, { dealId, managerId: manager.id });

    await addDealComment(ctx, {
      dealId,
      comment: resultMessage.message,
      fromUserId: dealInfo.user_id,
    });

    await updateDealInfo(ctx, {
      dealId,
      addfields: { deal_response: 'OK', deal_response_msg: prepareData(resultMessage) },
    });

    return resultMessage;
  } catch (error) {
    return handleError(ctx, req.query.dealId, error);
  }
};

app.get('/', handleRequest);