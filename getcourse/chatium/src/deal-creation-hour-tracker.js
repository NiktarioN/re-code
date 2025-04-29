/**
 * Plugin Name: deal-creation-hour-tracker
 * Description: Записывает час создания заказа в дополнительное поле
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getDealInfoWithParams, updateDealInfo } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: 'RE-CODE AGENCY. Метод «Запись часа создания заказа»',
  REQUIRED_PARAMS: ['dealId'],
  CUSTOM_FIELD_NAME: 'Час_создания_заказа',
  MESSAGES: {
    MISSING_REQUIRED_PARAM: (paramName) => `Обязательный параметр «${paramName}» не найден или имеет некорректный формат`,
    INVALID_DEAL_ID: 'Некорректный идентификатор заказа',
    DEAL_NOT_FOUND: 'Заказ не найден',
    SUCCESS: (hour) => `Час создания заказа (${hour}) успешно записан в дополнительное поле`,
    CREATION_DATE_MISSING: 'Дата создания заказа отсутствует',
    GENERAL_ERROR: 'Ошибка при попытке записать час создания заказа',
  },
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(CONFIG.MESSAGES.MISSING_REQUIRED_PARAM(missingParams.join(', ')));
  }
};

const handleError = async (ctx, dealId, error) => {
  const errorMessage = `${CONFIG.PLUGIN_NAME}: ${error.message || CONFIG.MESSAGES.GENERAL_ERROR}`;

  if (dealId) {
    await updateDealInfo(ctx, {
      dealId,
      addfields: { deal_response: 'ERROR', deal_response_msg: errorMessage },
    });
  }

  return { success: false, message: errorMessage };
};

const extractHourFromCreationDate = (createdAt) => {
  if (!createdAt) {
    throw new Error(CONFIG.MESSAGES.CREATION_DATE_MISSING);
  }

  const creationDate = new Date(createdAt);

  if (Number.isNaN(creationDate.getTime())) {
    throw new Error(`Некорректный формат даты создания: ${createdAt}`);
  }

  return creationDate.getHours();
};

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);
    const { dealId: dealIdStr } = req.query;
    const dealId = parseInt(dealIdStr, 10);

    if (Number.isNaN(dealId) || dealId <= 0) {
      throw new Error(CONFIG.MESSAGES.INVALID_DEAL_ID);
    }

    const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: false, customFields: false });

    if (!dealInfo) {
      throw new Error(CONFIG.MESSAGES.DEAL_NOT_FOUND);
    }

    const creationHour = extractHourFromCreationDate(dealInfo.created_at);
    const successMessage = CONFIG.MESSAGES.SUCCESS(creationHour);

    const addfields = {};
    addfields[CONFIG.CUSTOM_FIELD_NAME] = creationHour;
    addfields.deal_response = 'OK';
    addfields.deal_response_msg = successMessage;

    await updateDealInfo(ctx, {
      dealId,
      addfields
    });

    return { success: true, message: successMessage };
  } catch (error) {
    return handleError(ctx, req.query.dealId, error);
  }
};

app.get('/', handleRequest);