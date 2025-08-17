/**
 * Plugin Name: update-deal-with-params
 * Description: Обновить заказ в GetCourse
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { updateDealInfo } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Обновить заказ в GetCourse»',
  REQUIRED_PARAMS: ['dealId'],
  CUSTOM_FIELD_REGEX: /^field\[(.*?)\]$/,
  NUMERIC_PARAMS: ['dealId', 'funnelId', 'funnelStageId'],
  RESPONSE_FIELDS: {
    status: 'deal_response',
    message: 'deal_response_msg',
  },
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_NUMERIC_PARAM: (param) => `Параметр ${param} должен быть числом и больше 0`,
  GENERAL_ERROR: 'Ошибка при попытке обновить заказ в GetCourse',
  SUCCESS: (dealId) => `Сделка с ID ${dealId} успешно обновлена`,
};

const serializeData = (data) => (typeof data === 'object' ? JSON.stringify(data) : String(data));

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }
};

const handleError = async (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  errors: error.message || MESSAGES.GENERAL_ERROR,
});

const isPositiveNumber = (value) => {
  const num = Number(value);
  return value !== undefined && value !== null && String(value).trim() !== '' && !Number.isNaN(num) && num > 0;
};

const normalizeParams = (params) => {
  const normalizedParams = { ...params };

  CONFIG.NUMERIC_PARAMS.forEach((param) => {
    if (isPositiveNumber(params[param])) {
      normalizedParams[param] = Number(params[param]);
    } else if (params[param]) {
      throw new Error(MESSAGES.INVALID_NUMERIC_PARAM(param));
    }
  });

  if (params.tags) {
    normalizedParams.tags = params.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return normalizedParams;
};

const prepareCustomFields = (params) => {
  const customFields = {};

  Object.entries(params).forEach(([key, value]) => {
    const match = key.match(CONFIG.CUSTOM_FIELD_REGEX);
    if (match && match[1] && value) {
      customFields[match[1]] = value;
    }
  });

  return customFields;
};

const prepareDealData = (params, customFields) => {
  const { dealId, tags, funnelId, funnelStageId } = params;

  return {
    dealId,
    ...(tags?.length && { addtags: tags }),
    ...(funnelId && { funnel_id: funnelId }),
    ...(funnelStageId && { funnel_stage_id: funnelStageId }),
    ...(Object.keys(customFields).length && { addfields: customFields }),
  };
};

const updateDealResponse = async (ctx, dealId, responseData) => {
  await updateDealInfo(ctx, {
    dealId,
    addfields: {
      [CONFIG.RESPONSE_FIELDS.status]: 'OK',
      [CONFIG.RESPONSE_FIELDS.message]: serializeData(responseData),
    },
  });
};

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);
    const params = normalizeParams(req.query);
    const customFields = prepareCustomFields(req.query);
    const dealData = prepareDealData(params, customFields);

    const result = await updateDealInfo(ctx, dealData);
    await updateDealResponse(ctx, result.id, result);

    return {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: MESSAGES.SUCCESS(result.id),
      data: dealData,
    };
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);