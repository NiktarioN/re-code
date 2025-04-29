/**
 * Plugin Name: create-deal-with-params
 * Description: Создать заказ в GetCourse
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { createDeal } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Создать заказ в GetCourse»',
  REQUIRED_PARAMS: ['offerCode'],
  CUSTOM_FIELD_REGEX: /^field\[(.*?)\]$/,
  NUMERIC_PARAMS: ['funnelId', 'funnelStageId'],
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  DEAL_CREATED: (dealId) => `Сделка с ID ${dealId} успешно создана`,
  DEAL_CREATION_ERROR: (errorMessage) => `Произошла ошибка при создании сделки: ${errorMessage}`,
  ERROR_DEAL_STATUS: (status) =>
    `Недопустимый статус (${status}) в заказе. Используй только new (новый) или payed (завершен)`,
  GENERAL_ERROR: 'Ошибка при попытке создать заказ в GetCourse',
  USER_ID_REQUIRED: 'Необходимо указать userEmail или userGetCourseId в запросе',
  INVALID_NUMERIC_PARAM: (param) => `Параметр ${param} должен быть числом`,
};

const VALID_DEAL_STATUSES = new Set([
  'new',
  'payed',
  'cancelled',
  'false',
  'in_work',
  'payment_waiting',
  'part_payed',
  'waiting_for_return',
  'not_confirmed',
  'pending',
]);

const validateParams = (params) => {
  const errors = [];

  const missingBasicParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);
  if (missingBasicParams.length) {
    errors.push(MESSAGES.MISSING_REQUIRED_PARAMS(missingBasicParams.join(', ')));
  }

  if (!params.userEmail && !params.userGetCourseId) {
    errors.push(MESSAGES.USER_ID_REQUIRED);
  }

  if (params.dealStatus && !VALID_DEAL_STATUSES.has(params.dealStatus)) {
    errors.push(MESSAGES.INVALID_DEAL_STATUS(params.dealStatus));
  }

  if (errors.length) {
    throw new Error(errors.join('; '));
  }
};

const handleError = async (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  errors: error.message || MESSAGES.GENERAL_ERROR,
});

const normalizeParams = (params) => {
  const normalizedParams = { ...params };

  CONFIG.NUMERIC_PARAMS.forEach((param) => {
    if (params[param] && !Number.isNaN(Number(params[param]))) {
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

const createUserData = (params) => {
  const { userEmail, userGetCourseId, userPhone } = params;

  return {
    ...(userGetCourseId && { id: userGetCourseId }),
    ...(userEmail && { email: userEmail }),
    ...(userPhone && { phone: userPhone }),
  };
};

const createDealDetails = (params, customFields) => {
  const { offerCode, dealStatus, tags, comment, funnelId, funnelStageId } = params;

  return {
    offers: [{ offer_id: offerCode }],
    ...(params.dealStatus && { deal_status: dealStatus }),
    disable_notifications: false,
    recalc_user_product: 1,
    ...(tags?.length && { addtags: tags }),
    ...(comment && { deal_comment: comment }),
    ...(funnelId && { funnel_id: funnelId }),
    ...(funnelStageId && { funnel_stage_id: funnelStageId }),
    ...(Object.keys(customFields).length && { addfields: customFields }),
  };
};

const prepareDealData = (params, customFields) => ({
  user: createUserData(params),
  deal: createDealDetails(params, customFields),
});

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);
    const params = normalizeParams(req.query);

    const customFields = prepareCustomFields(req.query);
    const dealData = prepareDealData(params, customFields);

    const result = await createDeal(ctx, dealData);

    if (!result.success) {
      throw new Error(result.error_message);
    }

    return {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: MESSAGES.DEAL_CREATED(result.deal_id),
      dealLink: `https://${ctx.account.host}/sales/control/deal/update/id/${result.deal_id}`,
      data: dealData,
    };
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);
